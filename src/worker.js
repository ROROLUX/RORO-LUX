// RORO LUX — Cloudflare Worker.
//
// Static pages are served straight from ./public by Cloudflare's asset
// handling. Only /api/* reaches this script (see "run_worker_first" in
// wrangler.jsonc).
//
//   POST /api/waitlist  – pre-launch sign-ups, stored in D1
//   POST /api/contact   – contact-form messages, stored in D1 and, if email
//                         is configured, forwarded to the team inbox
//
// Bindings and settings:
//   DB                  D1 database (required)
//   RESEND_API_KEY      secret, optional – enables contact-form email alerts
//   CONTACT_TO_EMAIL    var, optional    – inbox that receives the alerts
//   CONTACT_FROM_EMAIL  var, optional    – verified sender, e.g.
//                                          "RORO LUX Website <website@yourdomain>"

import { products } from './data/products.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FRAGRANCES = new Set(products.map((p) => p.slug));
const FORMATS = new Set(['candle', 'diffuser']);
const TOPICS = new Set(['General', 'The collection', 'Gifting or corporate orders', 'Collaboration or press', 'Stockists']);
// Bump when the consent wording on the waitlist form changes.
const CONSENT_VERSION = '2026-10-15';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT,
    fragrance TEXT,
    format TEXT,
    consent_version TEXT NOT NULL,
    consented_at TEXT NOT NULL,
    country TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    topic TEXT,
    message TEXT NOT NULL,
    country TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
];

// Columns added after the first release. Each is applied once to databases
// created before it existed; "duplicate column" errors mean it is already there.
const MIGRATIONS = ['ALTER TABLE waitlist ADD COLUMN format TEXT'];

let schemaReady = false;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/waitlist' || url.pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405, { Allow: 'POST' });
      }
      if (!sameOrigin(request, url)) {
        return json({ error: 'Forbidden' }, 403);
      }
      if (!env.DB) {
        console.error('D1 binding "DB" is missing — check wrangler.jsonc');
        return json({ error: 'Sign-ups are temporarily unavailable. Please try again later.' }, 503);
      }

      let data;
      try {
        data = await request.json();
      } catch {
        return json({ error: 'Invalid request.' }, 400);
      }
      if (!data || typeof data !== 'object') {
        return json({ error: 'Invalid request.' }, 400);
      }
      // Honeypot: real visitors never see or fill this field.
      if (clean(data.company)) {
        return json({ ok: true }, 200);
      }

      try {
        await ensureSchema(env.DB);
        return url.pathname === '/api/waitlist'
          ? await handleWaitlist(request, env, data)
          : await handleContact(request, env, data);
      } catch (err) {
        console.error('API error', err);
        return json({ error: 'Something went wrong on our side. Please try again in a moment.' }, 500);
      }
    }

    if (url.pathname.startsWith('/api/')) {
      return json({ error: 'Not found' }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleWaitlist(request, env, data) {
  const email = clean(data.email, 254).toLowerCase();
  const name = clean(data.name, 80);
  const fragrance = FRAGRANCES.has(data.fragrance) ? data.fragrance : null;
  const format = FORMATS.has(data.format) ? data.format : null;

  if (!EMAIL_PATTERN.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (data.consent !== true && data.consent !== 'yes') {
    return json({ error: 'Please tick the box to confirm you would like to receive our emails.' }, 400);
  }

  const now = new Date().toISOString();
  await env.DB.prepare(
    `INSERT INTO waitlist (email, name, fragrance, format, consent_version, consented_at, country)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
     ON CONFLICT(email) DO UPDATE SET
       name = COALESCE(excluded.name, waitlist.name),
       fragrance = COALESCE(excluded.fragrance, waitlist.fragrance),
       format = COALESCE(excluded.format, waitlist.format),
       consent_version = excluded.consent_version,
       consented_at = excluded.consented_at,
       updated_at = datetime('now')`,
  )
    .bind(email, name || null, fragrance, format, CONSENT_VERSION, now, request.cf?.country || null)
    .run();

  return json({ ok: true, message: 'Thank you — you are on the list. We will be in touch before launch.' }, 200);
}

async function handleContact(request, env, data) {
  const name = clean(data.name, 120);
  const email = clean(data.email, 254);
  const topic = TOPICS.has(data.topic) ? data.topic : 'General';
  const message = clean(data.message, 4000, true);

  if (!name || !message) {
    return json({ error: 'Please add your name and a message.' }, 400);
  }
  if (!EMAIL_PATTERN.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }

  await env.DB.prepare('INSERT INTO messages (name, email, topic, message, country) VALUES (?1, ?2, ?3, ?4, ?5)')
    .bind(name, email, topic, message, request.cf?.country || null)
    .run();

  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL) {
    // The message is already saved, so an email failure is logged rather
    // than shown to the visitor.
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL,
          to: env.CONTACT_TO_EMAIL,
          reply_to: email,
          subject: `Website message: ${topic} — ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`,
        }),
      });
      if (!res.ok) console.error('Resend error', res.status, await res.text());
    } catch (err) {
      console.error('Resend request failed', err);
    }
  }

  return json({ ok: true, message: 'Thank you for your message. We will reply as soon as we can.' }, 200);
}

async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch(SCHEMA.map((sql) => db.prepare(sql)));
  for (const sql of MIGRATIONS) {
    try {
      await db.prepare(sql).run();
    } catch (err) {
      if (!/duplicate column/i.test(String(err?.message || err))) throw err;
    }
  }
  schemaReady = true;
}

// Browsers always send Origin on cross-site POSTs; reject any that don't
// come from this site.
function sameOrigin(request, url) {
  const origin = request.headers.get('Origin');
  return !origin || origin === url.origin;
}

function clean(value, max = 200, multiline = false) {
  if (typeof value !== 'string') return '';
  let s = value.replace(/\r\n/g, '\n');
  s = multiline ? s.replace(/[^\S\n]+/g, ' ') : s.replace(/\s+/g, ' ');
  return s.trim().slice(0, max);
}

function json(body, status, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}
