# RORO LUX — website

The pre-launch website for RORO LUX, a luxury home-fragrance brand inspired by
emotional wellbeing. It runs on Cloudflare Workers: static pages, plus two small
form endpoints that store waitlist sign-ups and contact messages in a Cloudflare
D1 database.

## What is in the first release

| Page | Path |
| --- | --- |
| Home | `/` |
| Scented candles | `/collection` |
| Candle pages (×5) | `/collection/stay-grounded`, `/safe`, `/healing`, `/quiet-the-noise`, `/balance` |
| Reed diffusers | `/diffusers` |
| Diffuser pages (×5) | `/diffusers/stay-grounded`, `/safe`, `/healing`, `/quiet-the-noise`, `/balance` |
| Our Story | `/story` |
| Our Purpose (with a support-lines section) | `/purpose` |
| Journal (4 starter entries) | `/journal` |
| Contact & FAQs | `/contact` |
| Privacy policy | `/privacy` |

Every fragrance comes in two formats:

| Format | Size | Price |
| --- | --- | --- |
| Scented candle | 200 ml clear glass jar | KSh 3,000 |
| Reed diffuser (made with essential oils) | 100 ml clear glass bottle, reeds included | KSh 4,500 |

Every product is marked **In development — join the waitlist**. The waitlist
asks visitors which fragrance and which format they are most drawn to, which
gives you real demand data for deciding what to produce first.

**On the essential-oil claim.** The site says the diffusers are *made with*
essential oils — never "100%" or "only". Some of the current notes (rain,
petrichor, white musk, lily of the valley) have no essential-oil equivalent,
and the FAQ says so plainly. Once your supplier confirms each diffuser's
formula, publish it on the product page (`src/pages/collection.js`).

## Editing content

All content lives in `src/`. You never edit `public/` — it is rebuilt from `src/`
on every deploy.

| To change… | Edit |
| --- | --- |
| Domain, email, Instagram, TikTok, legal name | `src/site.config.js` |
| Product names, notes, descriptions, colours, prices, sizes, status (candle and diffuser) | `src/data/products.js` |
| FAQs | `src/data/faqs.js` |
| Journal entries | `src/data/journal.js` |
| Page copy | `src/pages/*.js` |
| Styles | `src/static/css/site.css` |

Empty settings in `site.config.js` (email, social links, domain) are left off the
site automatically, and the build prints a reminder for each one.

**Photography.** Until product photos exist, each candle is shown as an
illustration of the real product (clear jar, white soy wax, white label, name in
its colour), and each diffuser as an illustration of the clear bottle with reeds. To
use a photo, put it in `src/static/images/` and set the product’s `image` (candle)
or `diffuserImage` field, e.g. `diffuserImage: '/images/safe-diffuser.jpg'`.
Portrait 4:5 works best.

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
SELECT email, name, fragrance, format, created_at FROM waitlist ORDER BY created_at DESC;
SELECT fragrance, COUNT(*) AS votes FROM waitlist GROUP BY fragrance ORDER BY votes DESC;
SELECT format, COUNT(*) AS votes FROM waitlist GROUP BY format ORDER BY votes DESC;
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
| `labels/candle-*.pdf` | **Print-ready candle labels**, 48 × 72 mm, vector, one per fragrance |
| `labels/candle-*.svg` | The same candle labels as editable SVG |
| `labels/diffuser-*.svg` | Bottle-label concepts, 55 × 71 mm, one per fragrance (earlier style) |
| `mockups/mockup-*.jpg` | Photorealistic 3D renders of each candle, a close-up and the collection |

### Candle labels

The candle labels follow the approved layout in `source/label-reference.png`.
They use Cormorant Garamond (RORO LUX), Kurale (candle name and notes),
Montserrat (small capitals) and Source Serif 4 (the three features) — all SIL
Open Font License, so they may be printed commercially. Every letter is
converted to vector outlines: the printer needs no fonts.

Before printing, check:

- **Size.** 48 × 72 mm for the 200 ml jar, pending final confirmation with the
  printer. If the die line differs, change `LABEL_MM` in
  `source/make_candle_labels.py` — the layout scales, the fonts do not change.
- **Claims.** Confirmed: the candles are hand-poured in Kenya with 100% natural
  soy wax. The label text is set at the top of `source/make_candle_labels.py`.
- **Fonts.** The candle-label fonts are fixed (approved on the mockups). Do not
  substitute them.
- **Net weight.** Weigh the wax in a filled jar; a 200 ml jar usually holds less
  than 200 g of soy wax.

Regenerate after any change:
`pip install fonttools brotli uharfbuzz cairosvg && python3 brand/source/make_candle_labels.py`

The diffuser label concepts must be resized to your printer's die line once the
100 ml bottle is confirmed. Regenerate them with
`pip install fonttools brotli && npm run brand`.

### Mockups

`mockups/` holds 3D renders of the candles, built from the real label files
on a modelled clear 200 ml glass jar (72 mm × 86 mm) with white soy wax and a
cotton wick. They are renders, not photographs; replace them with product
photography once production samples exist. The scene is in
`source/mockup/scene.html` (three.js).

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
