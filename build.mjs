// Builds the static site into ./public. No dependencies — Node 18+ only.
// Runs automatically before `wrangler dev` and `wrangler deploy`
// (see "build" in wrangler.jsonc), or by hand with `npm run build`.

import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/site.config.js';
import { products } from './src/data/products.js';
import { posts } from './src/data/journal.js';
import home from './src/pages/home.js';
import story from './src/pages/story.js';
import purpose from './src/pages/purpose.js';
import contact from './src/pages/contact.js';
import { collection, productPage } from './src/pages/collection.js';
import { journalIndex, journalPost } from './src/pages/journal.js';
import { privacy, notFound } from './src/pages/legal.js';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'public');

// [public file, html, include in sitemap]
const pages = [
  ['index.html', home(), true],
  ['collection.html', collection(), true],
  ...products.map((p) => [`collection/${p.slug}.html`, productPage(p), true]),
  ['story.html', story(), true],
  ['purpose.html', purpose(), true],
  ['journal.html', journalIndex(), true],
  ...posts.map((p) => [`journal/${p.slug}.html`, journalPost(p), true]),
  ['contact.html', contact(), true],
  ['privacy.html', privacy(), true],
  ['404.html', notFound(), false],
];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp(join(ROOT, 'src', 'static'), OUT, { recursive: true });

for (const [file, html] of pages) {
  const target = join(OUT, file);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}

if (site.url) {
  const toPath = (file) => '/' + file.replace(/index\.html$/, '').replace(/\.html$/, '');
  const urls = pages
    .filter(([, , inSitemap]) => inSitemap)
    .map(([file]) => `  <url><loc>${site.url}${toPath(file)}</loc></url>`)
    .join('\n');
  await writeFile(
    join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  );
  await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
} else {
  await writeFile(join(OUT, 'robots.txt'), 'User-agent: *\nAllow: /\n');
}

const reminders = [
  !site.url && 'site.url (needed for the sitemap, canonical links and social previews)',
  !site.email && 'site.email (customer-care address)',
  !site.instagram && 'site.instagram',
  !site.tiktok && 'site.tiktok',
].filter(Boolean);

console.log(`Built ${pages.length} pages into public/`);
if (reminders.length) {
  console.log('Not yet set in src/site.config.js (left off the site until filled in):');
  for (const r of reminders) console.log(`  - ${r}`);
}
