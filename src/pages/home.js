import { layout, esc, candleArt, diffuserArt, productCard, waitlistForm } from '../lib/layout.js';
import { products, productBySlug, formatPrice, FORMATS } from '../data/products.js';

export default function home() {
  const hero = productBySlug('safe');
  const feelings = products
    .map(
      (p) => `<li><a href="/collection/${p.slug}">
        <span class="feeling-text">${esc(p.feeling)}</span>
        <span class="feeling-name candle-name tone-${p.tone}">${esc(p.name)}</span>
      </a></li>`,
    )
    .join('');

  const body = `
<section class="hero">
  <div class="hero-light" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow">RORO LUX · Scent for intentional living</p>
      <h1>Make room for yourself.</h1>
      <p class="lede">Thoughtfully curated fragrances for the spaces you inhabit and the moments that matter.</p>
      <div class="actions">
        <a class="button" href="/collection">Discover the collection</a>
        <a class="button button-ghost" href="/story">Read our story</a>
      </div>
      <p class="hero-note">Luxury home fragrance, inspired by emotional wellbeing.</p>
    </div>
    <div class="hero-art">${candleArt(hero, { size: 'hero', lit: true })}</div>
  </div>
</section>

<section class="section intro">
  <div class="container narrow center">
    <p class="eyebrow">More than a fragrance</p>
    <h2>The way we care for ourselves deserves intention.</h2>
    <p>RORO LUX creates thoughtfully curated home fragrances inspired by the feelings and experiences that shape us. Each fragrance tells a story — a reminder to find stillness, a moment to return to yourself, a familiar warmth that makes a space feel like home.</p>
    <p>Our journey begins with scented candles and reed diffusers. Our purpose extends beyond them: to encourage self-awareness, nurture meaningful rituals, and contribute to more open conversations about mental health.</p>
    <a class="text-link" href="/story">Why RORO LUX exists</a>
  </div>
</section>

<section class="section section-soft" aria-labelledby="collection-title">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">The first collection</p>
      <h2 id="collection-title">Fragrance with a feeling.</h2>
      <p>Five signature fragrances, each developed around an emotional theme — as scented candles and as reed diffusers. Choose by the atmosphere you want to create, or the message you want to give.</p>
    </div>
    <div class="product-grid">${products.map((p) => productCard(p, 'candle')).join('')}</div>
  </div>
</section>

<section class="section diffuser-band" aria-labelledby="diffuser-title">
  <div class="container split split-art">
    <div class="band-art">${diffuserArt(productBySlug('quiet-the-noise'), { size: 'band' })}</div>
    <div>
      <p class="eyebrow">New · Reed diffusers</p>
      <h2 id="diffuser-title">The same five feelings, without a flame.</h2>
      <p>Every fragrance in the collection is also a reed diffuser, made with essential oils — a constant, quiet presence for entrances, bathrooms, workspaces and every room where a flame is not practical.</p>
      <p class="product-card-meta band-meta"><span>${formatPrice(FORMATS.diffuser.price)}</span><span>${FORMATS.diffuser.size} clear glass bottle</span></p>
      <div class="actions"><a class="button" href="/diffusers">Discover the diffusers</a></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="feel-title">
  <div class="container narrow">
    <div class="section-head center">
      <p class="eyebrow">Find your fragrance</p>
      <h2 id="feel-title">How would you like your space to feel?</h2>
    </div>
    <ul class="feeling-list">${feelings}</ul>
  </div>
</section>

<section class="section section-soft" aria-labelledby="pillars-title">
  <div class="container">
    <div class="section-head center">
      <p class="eyebrow">What goes into everything we make</p>
      <h2 id="pillars-title">Fragrance. Design. Meaning.</h2>
    </div>
    <div class="pillars">
      <div class="pillar">
        <h3>Fragrance</h3>
        <p>Balanced scent profiles with distinct opening, heart and base notes — selected, sampled and tested before they are approved for production.</p>
      </div>
      <div class="pillar">
        <h3>Design</h3>
        <p>Hand-poured in Kenya with 100% natural soy wax and no added colour, in clear glass with a minimal white label. Understated enough to belong in any room.</p>
      </div>
      <div class="pillar">
        <h3>Meaning</h3>
        <p>Every fragrance is named for a feeling — so choosing one becomes a small act of attention, for yourself or someone you love.</p>
      </div>
    </div>
  </div>
</section>

<section class="section purpose-band" aria-labelledby="purpose-title">
  <div class="container narrow center">
    <p class="eyebrow">Our purpose</p>
    <h2 id="purpose-title">Mental health deserves the same care as physical health.</h2>
    <p>RORO LUX exists to make emotional wellbeing more visible in everyday life, one intentional moment at a time. We are honest about our role: a candle or a diffuser is not therapy. But a quiet moment, a familiar fragrance and an open conversation can be a place to begin.</p>
    <a class="text-link" href="/purpose">Read about our purpose</a>
  </div>
</section>

${waitlistForm()}
`;
  return layout({ path: '/', title: '', body, nav: '' });
}
