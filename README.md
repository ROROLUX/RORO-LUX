# RORO LUX — website

The pre-launch website for RORO LUX, a luxury home-fragrance brand inspired by
emotional wellbeing. It runs on Cloudflare Workers: static pages, plus two small
form endpoints that store waitlist sign-ups and contact messages in a Cloudflare
D1 database.

## What is in the first release

| Page | Path |
| --- | --- |
| Home | `/` |
| The Collection | `/collection` |
| Product pages (×5) | `/collection/stay-grounded`, `/safe`, `/healing`, `/quiet-the-noise`, `/balance` |
| Our Story | `/story` |
| Our Purpose (with a support-lines section) | `/purpose` |
| Journal (3 starter entries) | `/journal` |
| Contact & FAQs | `/contact` |
| Privacy policy | `/privacy` |

Every product is marked **In development — join the waitlist**. The waitlist
asks visitors which fragrance they are most drawn to, which gives you real
demand data for deciding which fragrances to produce first.

## Editing content

All content lives in `src/`. You never edit `public/` — it is rebuilt from `src/`
on every deploy.

| To change… | Edit |
| --- | --- |
| Domain, email, Instagram, TikTok, legal name | `src/site.config.js` |
| Product names, notes, descriptions, colours, price, size, status | `src/data/products.js` |
| FAQs | `src/data/faqs.js` |
| Journal entries | `src/data/journal.js` |
| Page copy | `src/pages/*.js` |
| Styles | `src/static/css/site.css` |

Empty settings in `site.config.js` (email, social links, domain) are left off the
site automatically, and the build prints a reminder for each one.

**Photography.** Until product photos exist, each candle is shown as an
illustration of the real product (clear jar, plain white wax, white label, name in
its colour). To use a photo, put it in `src/static/images/` and set the product’s
`image` field, e.g. `image: '/images/stay-grounded.jpg'`. Portrait 4:5 works best.

## Running it locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # builds the site and serves it at http://localhost:8787
```

Forms work locally too; submissions go into a local copy of the database.

## Deploying to Cloudflare

### Option A — from your computer

```bash
npx wrangler login
npm run deploy
```

On the first deploy Wrangler creates the `roro-lux` D1 database automatically and
writes its `database_id` into `wrangler.json`. Commit that change so future
deploys stay linked to the same database.

### Option B — automatic deploys from GitHub (Workers Builds)

In the Cloudflare dashboard: **Workers & Pages → Create → Import a repository**,
pick the `RORO-LUX` repository, and set:

- **Root directory:** leave as the repository root
- **Build command:** leave empty (Wrangler runs the build itself)
- **Deploy command:** `npx wrangler deploy`

Every push to the production branch then redeploys the site.

### Connecting your domain

Once the domain is on Cloudflare: **Workers & Pages → roro-lux → Settings →
Domains & Routes → Add → Custom domain**. Then set `url` in
`src/site.config.js` (for example `https://www.rorolux.com`) and redeploy. This
switches on the sitemap, canonical links and social-sharing previews.

## Reading sign-ups and messages

In the dashboard: **Storage & Databases → D1 → roro-lux → Console**, then run:

```sql
SELECT email, name, fragrance, created_at FROM waitlist ORDER BY created_at DESC;
SELECT fragrance, COUNT(*) AS votes FROM waitlist GROUP BY fragrance ORDER BY votes DESC;
SELECT name, email, topic, message, created_at FROM messages ORDER BY created_at DESC;
```

Or from a terminal: `npx wrangler d1 execute roro-lux --remote --command "SELECT * FROM waitlist"`.

### Optional: email alerts for contact messages

Messages are always saved to the database. To also receive each one by email,
create a [Resend](https://resend.com) account, verify your domain there, then:

1. Add to `wrangler.json`:
   ```json
   "vars": {
     "CONTACT_TO_EMAIL": "hello@yourdomain",
     "CONTACT_FROM_EMAIL": "RORO LUX Website <website@yourdomain>"
   }
   ```
2. Run `npx wrangler secret put RESEND_API_KEY` and paste the API key.
3. Redeploy.

## Brand files

`brand/` contains the logo and label artwork. All lettering is outlined, so the
files print identically on any machine.

| File | Use |
| --- | --- |
| `roro-lux-logo.svg` | Primary stacked logo (flame, wordmark, tagline) |
| `roro-lux-horizontal.svg` | One-line logo for headers, emails, invoices |
| `roro-lux-monogram.svg` | RL seal for lids, boxes, social avatars |
| `*-white.svg` | White versions for dark backgrounds |
| `labels/label-*.svg` | Front jar-label concepts, 70 × 90 mm, one per fragrance |

The label concepts must be resized to your printer’s die line once the exact
200 ml jar is confirmed. To regenerate everything after changing product data:
`pip install fonttools brotli && npm run brand`.

Typefaces: Cormorant Garamond (headings) and Jost (body), both under the SIL Open
Font License — free for commercial use, including on packaging.

## Not yet built (deliberately)

- **Checkout.** Products are waitlist-only. When you are ready to sell, connect a
  Kenyan payment gateway that supports M-Pesa and cards and settles to your
  business bank account (for example Paystack or Pesapal), then switch each
  product’s `status` to `'available'`.
- **Spam protection beyond the basics.** Forms already reject cross-site posts and
  use a hidden honeypot field. If spam appears, add Cloudflare Turnstile.
- **Email sending to the waitlist.** Export the list from D1 into your email
  tool of choice when you are ready to announce the launch.
