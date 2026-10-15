import { layout, esc, pageHero, waitlistForm } from '../lib/layout.js';
import { posts } from '../data/journal.js';

function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function journalIndex() {
  const list = posts
    .map(
      (p) => `<article class="post-card">
    <a href="/journal/${p.slug}">
      <p class="eyebrow">${esc(p.category)} · <time datetime="${p.date}">${formatDate(p.date)}</time></p>
      <h2>${esc(p.title)}</h2>
      <p>${esc(p.excerpt)}</p>
      <span class="text-link">Read</span>
    </a>
  </article>`,
    )
    .join('');
  const body = `
${pageHero({
  eyebrow: 'Journal',
  title: 'Notes on scent, ritual and wellbeing.',
  lede: 'Thoughtful, practical writing about intentional living, caring for your candles and diffusers, and the small rituals that make room for yourself.',
})}
<section class="section section-tight">
  <div class="container narrow"><div class="post-list">${list}</div></div>
</section>`;
  return layout({
    path: '/journal',
    title: 'Journal',
    description: 'The RORO LUX journal: notes on scent, self-care rituals, candle and diffuser care, and mental-health awareness.',
    body,
    nav: 'journal',
  });
}

export function journalPost(post) {
  const body = `
<article class="article">
  <header class="page-hero">
    <div class="container narrow">
      <p class="eyebrow"><a href="/journal">Journal</a> · ${esc(post.category)} · <time datetime="${post.date}">${formatDate(post.date)}</time></p>
      <h1>${esc(post.title)}</h1>
      <p class="lede">${esc(post.excerpt)}</p>
    </div>
  </header>
  <div class="section section-tight">
    <div class="container narrow prose">${post.body}</div>
  </div>
</article>
${waitlistForm()}`;
  return layout({
    path: `/journal/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    body,
    nav: 'journal',
  });
}
