import { layout, esc, productArt, productCard, productUrl, statusBadge, waitlistForm, pageHero } from '../lib/layout.js';
import { products, formatPrice, FORMATS } from '../data/products.js';

const CANDLE = FORMATS.candle;
const DIFFUSER = FORMATS.diffuser;

export function collection() {
  const body = `
${pageHero({
  eyebrow: 'Scented candles',
  title: 'Five fragrances, each with a feeling.',
  lede: 'Our first collection of scented candles, hand-poured in Kenya. 100% natural soy wax, a clear 200 ml glass jar and a white label carrying the name of the feeling behind it.',
})}
<section class="section section-tight">
  <div class="container">
    <div class="product-grid">${products.map((p) => productCard(p, 'candle')).join('')}</div>
    <div class="collection-facts">
      <div><h2>Size</h2><p>${CANDLE.size} clear glass jar</p></div>
      <div><h2>Price</h2><p>${formatPrice(CANDLE.price)} each</p></div>
      <div><h2>Availability</h2><p>In development — launching in Kenya</p></div>
    </div>
  </div>
</section>
${formatCrossSell('diffuser')}
${waitlistForm({ heading: 'Help us choose what comes first.', format: 'candle' })}
`;
  return layout({
    path: '/collection',
    title: 'Scented Candles',
    description:
      'Five signature scented candles by RORO LUX — Stay Grounded, Safe, Healing, Quiet the Noise and Balance. 200 ml clear glass jars, KSh 3,000.',
    body,
    nav: 'collection',
  });
}

export function diffusers() {
  const body = `
${pageHero({
  eyebrow: 'Reed diffusers',
  title: 'The same five feelings, without a flame.',
  lede: 'Every fragrance in our collection, also as a reed diffuser — blended with essential oils, in a clear 200 ml glass bottle with reeds included. A constant, quiet presence for the rooms you live in.',
})}
<section class="section section-tight">
  <div class="container">
    <div class="product-grid">${products.map((p) => productCard(p, 'diffuser')).join('')}</div>
    <div class="collection-facts">
      <div><h2>Size</h2><p>${DIFFUSER.size} clear glass bottle</p></div>
      <div><h2>Price</h2><p>${formatPrice(DIFFUSER.price)} each</p></div>
      <div><h2>Blend</h2><p>Made with essential oils</p></div>
    </div>
  </div>
</section>

<section class="section section-soft">
  <div class="container split">
    <div>
      <p class="eyebrow">Candle or diffuser?</p>
      <h2>Two ways to live with a fragrance.</h2>
    </div>
    <div class="prose">
      <p><strong>A candle</strong> is a ritual. You light it for a moment — an evening, a bath, a conversation — and put it out when the moment ends.</p>
      <p><strong>A reed diffuser</strong> is a presence. It scents a room continuously, with no flame and nothing to remember, which makes it well suited to entrances, bathrooms, workspaces and any room where an open flame is not practical.</p>
      <p>Many people choose both in the same fragrance: the diffuser for everyday atmosphere, the candle for the moments that deserve a little more attention.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container narrow">
    <div class="section-head"><p class="eyebrow">About our diffusers</p><h2>What goes into the bottle.</h2></div>
    <dl class="product-specs">
      <div><dt>Blend</dt><dd>Made with essential oils. The full formula for each fragrance will be published on its page before launch.</dd></div>
      <div><dt>Bottle</dt><dd>Clear glass, ${DIFFUSER.size}, with a white paper label</dd></div>
      <div><dt>Reeds</dt><dd>Included</dd></div>
      <div><dt>How long it lasts</dt><dd>We will publish a tested figure once production samples are approved</dd></div>
    </dl>
    <p class="small">Read <a href="/journal/reed-diffuser-care">how to care for your reed diffuser</a>, including safety guidance for homes with children and pets.</p>
  </div>
</section>

${waitlistForm({ heading: 'Be the first to know.', format: 'diffuser' })}
`;
  return layout({
    path: '/diffusers',
    title: 'Reed Diffusers',
    description:
      'RORO LUX reed diffusers made with essential oils — Stay Grounded, Safe, Healing, Quiet the Noise and Balance. 200 ml clear glass bottles, KSh 4,500.',
    body,
    nav: 'diffusers',
  });
}

/** A band inviting visitors to the other format. */
function formatCrossSell(format) {
  const f = FORMATS[format];
  const copy =
    format === 'diffuser'
      ? {
          eyebrow: 'Also in the collection',
          title: 'Every fragrance, also as a reed diffuser.',
          text: `Made with essential oils, in a clear ${f.size} glass bottle. ${formatPrice(f.price)}.`,
          cta: 'Explore the diffusers',
        }
      : {
          eyebrow: 'Also in the collection',
          title: 'Every fragrance, also as a scented candle.',
          text: `Hand-poured 100% natural soy wax in a clear ${f.size} glass jar. ${formatPrice(f.price)}.`,
          cta: 'Explore the candles',
        };
  return `<section class="section section-soft crosssell">
  <div class="container narrow center">
    <p class="eyebrow">${copy.eyebrow}</p>
    <h2>${copy.title}</h2>
    <p>${copy.text}</p>
    <a class="text-link" href="${f.base}">${copy.cta}</a>
  </div>
</section>`;
}

export function productPage(product) {
  return formatPage(product, 'candle');
}

export function diffuserPage(product) {
  return formatPage(product, 'diffuser');
}

function formatPage(product, format) {
  const f = FORMATS[format];
  const other = format === 'candle' ? 'diffuser' : 'candle';
  const isDiffuser = format === 'diffuser';
  const others = products.filter((p) => p.slug !== product.slug);

  const specs = isDiffuser
    ? `<div><dt>Bottle</dt><dd>Clear glass bottle, ${f.size}</dd></div>
        <div><dt>Blend</dt><dd>Made with essential oils</dd></div>
        <div><dt>Reeds</dt><dd>Included</dd></div>`
    : `<div><dt>Vessel</dt><dd>Clear glass jar, ${f.size}</dd></div>
        <div><dt>Wax</dt><dd>100% natural soy wax, no added colour</dd></div>
        <div><dt>Made</dt><dd>Hand-poured in Kenya</dd></div>`;

  const care = isDiffuser
    ? `<p>Remove the stopper, place the reeds in the bottle and turn them once after an hour so both ends are saturated. Turn the reeds about once a week to refresh the fragrance. Keep out of reach of children and pets, away from heat and open flames, and on a surface protected from drips — essential oils can mark polished wood and painted finishes. <a href="/journal/reed-diffuser-care">Full care guide</a>.</p>`
    : `<p>Let the first burn reach the edges of the jar. Trim the wick to about 5 mm before each use, burn for no more than four hours at a time, and never leave a lit candle unattended. <a href="/journal/candle-care">Full care guide</a>.</p>`;

  const ingredients = isDiffuser
    ? `<p>Our reed diffusers are made with essential oils. Some of the notes in this collection — such as rain, petrichor, white musk and lily of the valley — have no natural essential-oil equivalent, so we are confirming with our fragrance partner how each is expressed. The full formula and a tested lasting time will be published here before launch.</p>`
    : `<p>100% natural soy wax, hand-poured in Kenya. The full wick and fragrance specifications and a tested burn time will be published here before launch.</p>`;

  const body = `
<nav class="breadcrumb container" aria-label="Breadcrumb"><a href="${f.base}">${f.plural}</a><span aria-hidden="true">/</span><span>${esc(product.name)}</span></nav>
<section class="product">
  <div class="container product-grid-detail">
    <div class="product-art">${productArt(product, format, { size: 'detail', lit: true })}</div>
    <div class="product-info">
      <p class="eyebrow">No. ${product.number} · ${f.name}</p>
      <h1 class="candle-name tone-${product.tone}">${esc(product.name)}</h1>
      <p class="product-feeling">${esc(product.feeling)}</p>
      <p class="product-accord">${esc(product.accord)}</p>
      <p class="product-price"><span>${formatPrice(f.price)}</span><span>${f.size}</span></p>
      ${statusBadge(product, format)}
      <a class="button" href="#waitlist">Join the waitlist for ${esc(product.name)}</a>
      <p class="format-switch">Also available as a <a href="${productUrl(product, other)}">${FORMATS[other].name.toLowerCase()}</a> · ${formatPrice(FORMATS[other].price)}</p>

      <div class="product-description"><p>${esc(product.description)}</p></div>

      <dl class="product-specs">
        <div><dt>Notes</dt><dd>${product.notes.map(esc).join(' · ')}</dd></div>
        <div><dt>Mood</dt><dd>${product.mood.map(esc).join(' · ')}</dd></div>
        <div><dt>Perfect for</dt><dd>${product.perfectFor.map(esc).join(' · ')}</dd></div>
        ${specs}
      </dl>

      <details class="disclosure">
        <summary>Why it belongs in the collection</summary>
        <p>${esc(product.why)}</p>
      </details>
      <details class="disclosure">
        <summary>${isDiffuser ? 'Using your diffuser' : 'Candle care'}</summary>
        ${care}
      </details>
      <details class="disclosure">
        <summary>${isDiffuser ? 'Ingredients and lasting time' : 'Ingredients and burn time'}</summary>
        ${ingredients}
      </details>
    </div>
  </div>
</section>
${waitlistForm({
  heading: isDiffuser ? `Be the first to bring ${esc(product.name)} home.` : `Be the first to light ${esc(product.name)}.`,
  selected: product.slug,
  format,
})}
<section class="section section-soft">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Also in the collection</p><h2>Explore the other feelings.</h2></div>
    <div class="product-grid product-grid-4">${others.map((p) => productCard(p, format)).join('')}</div>
  </div>
</section>
`;
  return layout({
    path: productUrl(product, format),
    title: `${product.name} — ${f.name}`,
    description: `${product.name} ${f.name.toLowerCase()} by RORO LUX: ${product.feeling} Notes of ${product.notes
      .join(', ')
      .toLowerCase()}. ${isDiffuser ? 'Made with essential oils. ' : ''}${f.size}, ${formatPrice(f.price)}.`,
    body,
    nav: isDiffuser ? 'diffusers' : 'collection',
  });
}
