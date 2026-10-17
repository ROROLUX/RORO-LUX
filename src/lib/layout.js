// Shared page shell and components. Pages are plain template-literal HTML.

import { site } from '../site.config.js';
import { products, formatPrice, FORMATS, statusOf, imageOf } from '../data/products.js';

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const NAV = [
  { href: '/collection', label: 'Candles', key: 'collection' },
  { href: '/diffusers', label: 'Diffusers', key: 'diffusers' },
  { href: '/story', label: 'Our Story', key: 'story' },
  { href: '/purpose', label: 'Our Purpose', key: 'purpose' },
  { href: '/journal', label: 'Journal', key: 'journal' },
  { href: '/contact', label: 'Contact', key: 'contact' },
];

/**
 * @param {object} opts
 * @param {string} opts.path      Public path, e.g. '/story'
 * @param {string} opts.title     Page title (brand name is appended)
 * @param {string} opts.description
 * @param {string} opts.body      Main content HTML
 * @param {string} [opts.nav]     Active nav key
 * @param {boolean} [opts.noindex]
 */
export function layout({ path, title, description, body, nav = '', noindex = false }) {
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`;
  const canonical = site.url ? `${site.url}${path === '/' ? '/' : path}` : '';
  const ogImage = site.url ? `${site.url}/brand/og-image.png` : '';

  return `<!doctype html>
<html lang="en-KE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || site.description)}">
${noindex ? '<meta name="robots" content="noindex">' : ''}
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description || site.description)}">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#FFFFFF">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/fonts/cormorant-garamond-latin-300-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jost-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css">
<script src="/js/site.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
${header(nav)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>
`;
}

function header(active) {
  const links = NAV.map(
    (item) =>
      `<li><a href="${item.href}"${item.key === active ? ' aria-current="page"' : ''}>${item.label}</a></li>`,
  ).join('');
  return `<header class="site-header">
  <div class="announce"><p>Our first collection is in development. <a href="/#waitlist">Join the waitlist</a> to hear first.</p></div>
  <div class="header-inner">
    <a class="brand" href="/" aria-label="RORO LUX — home"><img src="/brand/logo-horizontal.svg" alt="RORO LUX" width="230" height="34"></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="visually-hidden">Menu</span><span class="nav-toggle-bar" aria-hidden="true"></span></button>
    <nav id="site-nav" class="site-nav" aria-label="Main"><ul>${links}</ul></nav>
  </div>
</header>`;
}

function footer() {
  const social = [
    site.instagram && `<li><a href="${esc(site.instagram)}" rel="noopener" target="_blank">Instagram</a></li>`,
    site.tiktok && `<li><a href="${esc(site.tiktok)}" rel="noopener" target="_blank">TikTok</a></li>`,
  ]
    .filter(Boolean)
    .join('');
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="/brand/logo.svg" alt="RORO LUX — Scent for intentional living" width="230" height="103">
      <p>Luxury home fragrance, inspired by emotional wellbeing. Based in ${esc(site.country)}.</p>
    </div>
    <div class="footer-cols">
      <div>
        <h2>Explore</h2>
        <ul>
          <li><a href="/collection">Scented candles</a></li>
          <li><a href="/diffusers">Reed diffusers</a></li>
          <li><a href="/story">Our Story</a></li>
          <li><a href="/purpose">Our Purpose</a></li>
          <li><a href="/journal">Journal</a></li>
        </ul>
      </div>
      <div>
        <h2>Care</h2>
        <ul>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/contact#faq">FAQs</a></li>
          <li><a href="/journal/candle-care">Candle care</a></li>
          <li><a href="/journal/reed-diffuser-care">Diffuser care</a></li>
          <li><a href="/privacy">Privacy</a></li>
        </ul>
      </div>
      ${
        site.email || social
          ? `<div>
        <h2>Connect</h2>
        <ul>
          ${site.email ? `<li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>` : ''}
          ${social}
        </ul>
      </div>`
          : ''
      }
    </div>
  </div>
  <div class="footer-note">
    <p>Our candles and diffusers are made to accompany everyday self-care — they are not a treatment for any mental-health condition or a substitute for professional care. If you are struggling, please reach out to someone you trust or a <a href="/purpose#support">support line</a>.</p>
    <p>© ${year} ${esc(site.legalName)}. All rights reserved.</p>
  </div>
</footer>`;
}

/**
 * An illustration of the actual product: a clear 200 ml glass jar, plain
 * white wax and a white label carrying the candle's name in its colour.
 * Replaced automatically by `product.image` once photography exists.
 */
export function candleArt(product, { size = 'md', lit = false } = {}) {
  if (product.image) {
    return productPhoto(product.image, `${product.name} scented candle in a clear glass jar`, size);
  }
  const id = `c-${product.slug}-${size}`;
  const nameLines = product.name.length > 10 ? splitName(product.name) : [product.name];
  const nameText = nameLines
    .map(
      (line, i) =>
        `<text x="120" y="${nameLines.length === 1 ? 192 : 184 + i * 15}" text-anchor="middle" class="art-name">${esc(line.toUpperCase())}</text>`,
    )
    .join('');
  return `<svg class="candle-art tone-${product.tone}" viewBox="0 0 240 300" role="img" aria-label="Illustration of ${esc(product.name)}: a clear glass jar with white wax and a white label">
  <defs>
    <linearGradient id="${id}-glass" x1="0" x2="1">
      <stop offset="0" stop-color="#E9ECEB" stop-opacity=".95"/>
      <stop offset=".12" stop-color="#FFFFFF" stop-opacity=".55"/>
      <stop offset=".55" stop-color="#F3F5F4" stop-opacity=".35"/>
      <stop offset=".9" stop-color="#DDE2E0" stop-opacity=".8"/>
      <stop offset="1" stop-color="#CDD3D1" stop-opacity=".95"/>
    </linearGradient>
    <linearGradient id="${id}-wax" x1="0" x2="1">
      <stop offset="0" stop-color="#ECEAE6"/>
      <stop offset=".35" stop-color="#FBFAF8"/>
      <stop offset="1" stop-color="#E7E4DF"/>
    </linearGradient>
    <radialGradient id="${id}-shadow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#1F1E1C" stop-opacity=".16"/>
      <stop offset="1" stop-color="#1F1E1C" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="128" cy="276" rx="104" ry="13" fill="url(#${id}-shadow)"/>
  <!-- wax -->
  <path d="M54 112 L54 262 Q54 270 62 270 L178 270 Q186 270 186 262 L186 112 Z" fill="url(#${id}-wax)"/>
  <ellipse cx="120" cy="112" rx="66" ry="9" fill="#F6F4F0"/>
  <ellipse cx="120" cy="112" rx="66" ry="9" fill="none" stroke="#E2DFDA" stroke-width="1"/>
  <!-- wick -->
  <path d="M120 112 L120 ${lit ? 100 : 98}" stroke="#3A3937" stroke-width="1.6" stroke-linecap="round"/>
  ${
    lit
      ? `<g class="flame"><path d="M121 64 C126 76 131 84 129 92 C127 100 113 100 111 92 C109 84 117 77 121 64 Z" fill="#F6E7C8"/><path d="M120.5 76 C123 83 125 88 124 92 C123 96 117 96 116 92 C115 88 118 84 120.5 76 Z" fill="#FFF9EC"/></g>`
      : ''
  }
  <!-- glass jar -->
  <path d="M46 62 L46 262 Q46 280 64 280 L176 280 Q194 280 194 262 L194 62" fill="url(#${id}-glass)" stroke="#C9CFCD" stroke-width="1.2"/>
  <ellipse cx="120" cy="62" rx="74" ry="10" fill="none" stroke="#C9CFCD" stroke-width="1.2"/>
  <path d="M58 76 L58 250" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".75"/>
  <path d="M182 82 L182 246" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".6"/>
  <!-- white paper label -->
  <rect x="72" y="130" width="96" height="118" rx="3" fill="#FFFFFF" stroke="#E4E1DC" stroke-width=".8"/>
  <path d="M120 141 C121.6 145 123 147.5 122.6 150 C122.2 152.4 117.8 152.4 117.4 150 C117 147.5 118.6 145 120 141 Z" fill="none" stroke="#2B2A28" stroke-width=".6"/>
  <text x="120" y="166" text-anchor="middle" class="art-brand">RORO LUX</text>
  ${nameText}
  <text x="120" y="236" text-anchor="middle" class="art-size">200 ML</text>
</svg>`;
}

/** A 4:5 product picture; the large hero and detail images load immediately. */
function productPhoto(src, alt, size) {
  const eager = size === 'hero' || size === 'detail';
  return `<img class="candle-photo" src="${esc(src)}" alt="${esc(alt)}" width="1000" height="1250"${eager ? '' : ' loading="lazy"'}>`;
}

function splitName(name) {
  const words = name.split(' ');
  return [words.slice(0, -1).join(' '), words[words.length - 1]];
}

/**
 * An illustration of the reed diffuser: a clear 200 ml glass bottle, reeds
 * reeds and the same white label as the candle. Replaced automatically by
 * `product.diffuserImage` once photography exists.
 */
export function diffuserArt(product, { size = 'md' } = {}) {
  if (product.diffuserImage) {
    return productPhoto(product.diffuserImage, `${product.name} reed diffuser in a clear glass bottle`, size);
  }
  const id = `d-${product.slug}-${size}`;
  const nameLines = product.name.length > 10 ? splitName(product.name) : [product.name];
  const nameText = nameLines
    .map(
      (line, i) =>
        `<text x="120" y="${nameLines.length === 1 ? 222 : 214 + i * 15}" text-anchor="middle" class="art-name">${esc(line.toUpperCase())}</text>`,
    )
    .join('');
  const reeds = [-34, -22, -12, -4, 5, 14, 24, 35]
    .map((dx, i) => `<path d="M${118 + (i % 3)} 126 L${120 + dx * 1.9} ${10 + (i % 4) * 7}" />`)
    .join('');
  return `<svg class="candle-art diffuser-art tone-${product.tone}" viewBox="0 0 240 300" role="img" aria-label="Illustration of the ${esc(product.name)} reed diffuser: a clear glass bottle with reeds and a white label">
  <defs>
    <linearGradient id="${id}-glass" x1="0" x2="1">
      <stop offset="0" stop-color="#E9ECEB" stop-opacity=".95"/>
      <stop offset=".14" stop-color="#FFFFFF" stop-opacity=".5"/>
      <stop offset=".6" stop-color="#F3F5F4" stop-opacity=".3"/>
      <stop offset="1" stop-color="#CDD3D1" stop-opacity=".95"/>
    </linearGradient>
    <linearGradient id="${id}-oil" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#F4EBD6" stop-opacity=".75"/>
      <stop offset="1" stop-color="#EADBB8" stop-opacity=".85"/>
    </linearGradient>
    <radialGradient id="${id}-shadow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#1F1E1C" stop-opacity=".16"/>
      <stop offset="1" stop-color="#1F1E1C" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="126" cy="282" rx="86" ry="11" fill="url(#${id}-shadow)"/>
  <!-- reeds -->
  <g class="reeds" stroke="#B79F7E" stroke-width="2" stroke-linecap="round" fill="none">${reeds}</g>
  <!-- essential-oil blend -->
  <path d="M60 196 L60 266 Q60 278 72 278 L168 278 Q180 278 180 266 L180 196 Z" fill="url(#${id}-oil)"/>
  <!-- glass bottle -->
  <path d="M106 112 L106 132 Q106 140 96 142 L74 146 Q56 150 56 170 L56 266 Q56 284 74 284 L166 284 Q184 284 184 266 L184 170 Q184 150 166 146 L144 142 Q134 140 134 132 L134 112 Z" fill="url(#${id}-glass)" stroke="#C9CFCD" stroke-width="1.2"/>
  <rect x="103" y="104" width="34" height="10" rx="2" fill="#F4F4F2" stroke="#C9CFCD" stroke-width="1"/>
  <path d="M66 162 L66 262" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" opacity=".75"/>
  <path d="M175 168 L175 258" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".6"/>
  <!-- white paper label -->
  <rect x="74" y="168" width="92" height="96" rx="3" fill="#FFFFFF" stroke="#E4E1DC" stroke-width=".8"/>
  <path d="M120 176 C121.6 180 123 182.5 122.6 185 C122.2 187.4 117.8 187.4 117.4 185 C117 182.5 118.6 180 120 176 Z" fill="none" stroke="#2B2A28" stroke-width=".6"/>
  <text x="120" y="199" text-anchor="middle" class="art-brand">RORO LUX</text>
  ${nameText}
  <text x="120" y="254" text-anchor="middle" class="art-size">REED DIFFUSER · 200 ML</text>
</svg>`;
}

export function productArt(product, format = 'candle', opts = {}) {
  return format === 'diffuser' ? diffuserArt(product, opts) : candleArt(product, opts);
}

export function productUrl(product, format = 'candle') {
  return `${FORMATS[format].base}/${product.slug}`;
}

export function productCard(product, format = 'candle') {
  const f = FORMATS[format];
  return `<article class="product-card">
  <a class="product-card-link" href="${productUrl(product, format)}">
    <div class="product-card-art">${productArt(product, format, { size: 'card' })}</div>
    <div class="product-card-body">
      <p class="eyebrow">No. ${product.number} · ${format === 'diffuser' ? 'Diffuser' : 'Candle'}</p>
      <h3 class="candle-name tone-${product.tone}">${esc(product.name)}</h3>
      <p class="product-card-feeling">${esc(product.feeling)}</p>
      <p class="product-card-notes">${esc(product.accord)}</p>
      <p class="product-card-meta"><span>${formatPrice(f.price)}</span><span>${f.size}</span></p>
    </div>
  </a>
</article>`;
}

export function statusBadge(product, format = 'candle') {
  const labels = {
    waitlist: 'In development — join the waitlist',
    available: 'Available now',
    'sold-out': 'Sold out',
  };
  const status = statusOf(product, format);
  return `<p class="status status-${status}">${labels[status] || ''}</p>`;
}

/** Pre-launch sign-up. Posts to /api/waitlist (see worker.js). */
export function waitlistForm({ heading = 'Be the first to know.', selected = '', format = '' } = {}) {
  const formatOptions = [
    ['', 'Candles and diffusers'],
    ['candle', 'Scented candles'],
    ['diffuser', 'Reed diffusers'],
  ]
    .map(([value, label]) => `<option value="${value}"${value === format ? ' selected' : ''}>${label}</option>`)
    .join('');
  const options = products
    .map(
      (p) =>
        `<option value="${p.slug}"${p.slug === selected ? ' selected' : ''}>${esc(p.name)} — ${esc(p.feeling)}</option>`,
    )
    .join('');
  return `<section class="waitlist" id="waitlist" aria-labelledby="waitlist-title">
  <div class="waitlist-inner">
    <p class="eyebrow">The waitlist</p>
    <h2 id="waitlist-title">${heading}</h2>
    <p class="lede">We are finalising our first collection and testing every fragrance before it goes into production. Join the list to hear about the launch first — and tell us which fragrance, and which format, you are most drawn to. Your answers help decide what we make first.</p>
    <form class="form" data-endpoint="/api/waitlist" novalidate>
      <div class="field-row">
        <div class="field">
          <label for="wl-name">First name <span class="optional">(optional)</span></label>
          <input id="wl-name" name="name" type="text" autocomplete="given-name" maxlength="80">
        </div>
        <div class="field">
          <label for="wl-email">Email address</label>
          <input id="wl-email" name="email" type="email" autocomplete="email" required maxlength="254">
        </div>
      </div>
      <div class="field">
        <label for="wl-fragrance">The fragrance you are most drawn to <span class="optional">(optional)</span></label>
        <select id="wl-fragrance" name="fragrance">
          <option value="">I’d like to hear about all of them</option>
          ${options}
        </select>
      </div>
      <div class="field">
        <label for="wl-format">I am most interested in <span class="optional">(optional)</span></label>
        <select id="wl-format" name="format">
          ${formatOptions}
        </select>
      </div>
      <div class="field field-hidden" aria-hidden="true">
        <label for="wl-company">Leave this field empty</label>
        <input id="wl-company" name="company" type="text" tabindex="-1" autocomplete="off">
      </div>
      <div class="field field-check">
        <input id="wl-consent" name="consent" type="checkbox" value="yes" required>
        <label for="wl-consent">I would like to receive emails from RORO LUX about the launch and new fragrances. I can unsubscribe at any time. See our <a href="/privacy">privacy policy</a>.</label>
      </div>
      <button class="button" type="submit">Join the waitlist</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>`;
}

export function pageHero({ eyebrow, title, lede }) {
  return `<section class="page-hero">
  <div class="container narrow">
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <h1>${title}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ''}
  </div>
</section>`;
}
