import { layout, esc, candleArt, productCard, statusBadge, waitlistForm, pageHero } from '../lib/layout.js';
import { products, formatPrice, SIZE_LABEL } from '../data/products.js';

export function collection() {
  const body = `
${pageHero({
  eyebrow: 'The Collection',
  title: 'Five fragrances, each with a feeling.',
  lede: 'Our first collection of scented candles. Plain white wax, a clear 200 ml glass jar and a white label carrying the name of the feeling behind it.',
})}
<section class="section section-tight">
  <div class="container">
    <div class="product-grid">${products.map(productCard).join('')}</div>
    <div class="collection-facts">
      <div><h2>Size</h2><p>${SIZE_LABEL} clear glass jar</p></div>
      <div><h2>Price</h2><p>${formatPrice()} each</p></div>
      <div><h2>Availability</h2><p>In development — launching in Kenya</p></div>
    </div>
  </div>
</section>
${waitlistForm({ heading: 'Help us choose what comes first.' })}
`;
  return layout({
    path: '/collection',
    title: 'The Collection',
    description:
      'Five signature scented candles by RORO LUX — Stay Grounded, Safe, Healing, Quiet the Noise and Balance. 200 ml clear glass jars, KSh 3,000.',
    body,
    nav: 'collection',
  });
}

export function productPage(product) {
  const others = products.filter((p) => p.slug !== product.slug);
  const body = `
<nav class="breadcrumb container" aria-label="Breadcrumb"><a href="/collection">The Collection</a><span aria-hidden="true">/</span><span>${esc(product.name)}</span></nav>
<section class="product">
  <div class="container product-grid-detail">
    <div class="product-art">${candleArt(product, { size: 'detail', lit: true })}</div>
    <div class="product-info">
      <p class="eyebrow">No. ${product.number} · Scented candle</p>
      <h1 class="candle-name tone-${product.tone}">${esc(product.name)}</h1>
      <p class="product-feeling">${esc(product.feeling)}</p>
      <p class="product-accord">${esc(product.accord)}</p>
      <p class="product-price"><span>${formatPrice()}</span><span>${SIZE_LABEL}</span></p>
      ${statusBadge(product)}
      <a class="button" href="#waitlist">Join the waitlist for ${esc(product.name)}</a>

      <div class="product-description"><p>${esc(product.description)}</p></div>

      <dl class="product-specs">
        <div><dt>Notes</dt><dd>${product.notes.map(esc).join(' · ')}</dd></div>
        <div><dt>Mood</dt><dd>${product.mood.map(esc).join(' · ')}</dd></div>
        <div><dt>Perfect for</dt><dd>${product.perfectFor.map(esc).join(' · ')}</dd></div>
        <div><dt>Vessel</dt><dd>Clear glass jar, ${SIZE_LABEL}</dd></div>
        <div><dt>Wax</dt><dd>Plain white, no added colour</dd></div>
      </dl>

      <details class="disclosure">
        <summary>Why it belongs in the collection</summary>
        <p>${esc(product.why)}</p>
      </details>
      <details class="disclosure">
        <summary>Candle care</summary>
        <p>Let the first burn reach the edges of the jar. Trim the wick to about 5 mm before each use, burn for no more than four hours at a time, and never leave a lit candle unattended. <a href="/journal/candle-care">Full care guide</a>.</p>
      </details>
      <details class="disclosure">
        <summary>Ingredients and burn time</summary>
        <p>We are confirming the final wax blend, wick and fragrance specifications with our production partner during sampling. Full ingredients and a tested burn time will be published here before launch.</p>
      </details>
    </div>
  </div>
</section>
${waitlistForm({ heading: `Be the first to light ${esc(product.name)}.`, selected: product.slug })}
<section class="section section-soft">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Also in the collection</p><h2>Explore the other feelings.</h2></div>
    <div class="product-grid product-grid-4">${others.map(productCard).join('')}</div>
  </div>
</section>
`;
  return layout({
    path: `/collection/${product.slug}`,
    title: `${product.name} — Scented Candle`,
    description: `${product.name} by RORO LUX: ${product.feeling} Notes of ${product.notes.join(', ').toLowerCase()}. 200 ml clear glass jar, KSh 3,000.`,
    body,
    nav: 'collection',
  });
}
