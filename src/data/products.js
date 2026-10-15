// The RORO LUX collection — the single source of truth for product details.
// Edit here and every page (collection, product pages, forms, labels) updates
// on the next build.
//
// Every fragrance comes in two formats: a scented candle and a reed diffuser.
//
// `status` (candle) and `diffuserStatus` control what a visitor can do:
//   'waitlist'  – in development; visitors can register interest (current)
//   'available' – on sale (requires checkout to be connected first)
//   'sold-out'  – shown, but not purchasable
//
// `labelNotes` is the short notes line printed on the jar label.
//
// `image` (candle) and `diffuserImage` take a photo path once photography
// exists, e.g. '/images/safe-diffuser.jpg'. Until then an illustration is shown.
//
// Name colours come from the brand palette and are reserved for fragrance
// names. Each passes WCAG AA contrast (4.5:1) on a white label and the website.

export const PRICE_KES = 3000;
export const SIZE_LABEL = '200 ml · 7.05 oz';

export const DIFFUSER_PRICE_KES = 4500;
export const DIFFUSER_SIZE_LABEL = '100 ml';

// Per-format details used by product cards, pages and forms.
export const FORMATS = {
  candle: {
    key: 'candle',
    name: 'Scented candle',
    plural: 'Scented candles',
    price: PRICE_KES,
    size: SIZE_LABEL,
    base: '/collection',
  },
  diffuser: {
    key: 'diffuser',
    name: 'Reed diffuser',
    plural: 'Reed diffusers',
    price: DIFFUSER_PRICE_KES,
    size: DIFFUSER_SIZE_LABEL,
    base: '/diffusers',
  },
};

export const products = [
  {
    slug: 'stay-grounded',
    number: '01',
    name: 'Stay Grounded',
    tone: 'sage',
    colorName: 'Muted sage',
    colorHex: '#66785F',
    feeling: 'Coming back to yourself.',
    accord: 'Rain-kissed earth · Fresh greenery · Quiet woods',
    notes: ['Rain', 'Petrichor', 'Soft moss', 'White musk'],
    labelNotes: 'Rain, Moss & White Musk',
    description:
      'Inspired by the distinctive freshness of rain falling on dry earth, Stay Grounded is envisioned as a refined, earthy fragrance with an airy opening, a green and mineral heart, and a soft woody-musk finish.',
    why:
      'A fresh, gender-neutral alternative to the sweet and floral fragrances commonly associated with candles — for those who prefer nature-inspired, understated scents.',
    mood: ['Grounded', 'Fresh', 'Present'],
    perfectFor: ['Rainy afternoons', 'Reading', 'Resetting after a busy day'],
    status: 'waitlist',
    image: null,
    diffuserStatus: 'waitlist',
    diffuserImage: null,
  },
  {
    slug: 'safe',
    number: '02',
    name: 'Safe',
    tone: 'beige',
    colorName: 'Warm beige',
    colorHex: '#8E7152',
    feeling: 'Warmth, comfort, and belonging.',
    accord: 'Creamy vanilla · Sandalwood · Soft amber',
    notes: ['Vanilla', 'Sandalwood', 'Soft amber'],
    labelNotes: 'Vanilla, Sandalwood & Amber',
    description:
      'Safe is envisioned as a smooth, enveloping fragrance that makes a space feel welcoming. Creamy vanilla provides familiarity, while sandalwood and a subtle amber accord introduce depth and sophistication.',
    why:
      'The collection’s warm, comforting option — for inviting interiors and cosy evenings, rich without an excessively sugary finish.',
    mood: ['Warm', 'Comforted', 'At home'],
    perfectFor: ['Cosy evenings', 'Hosting', 'Thoughtful gifts'],
    status: 'waitlist',
    image: null,
    diffuserStatus: 'waitlist',
    diffuserImage: null,
  },
  {
    slug: 'healing',
    number: '03',
    name: 'Healing',
    tone: 'taupe',
    colorName: 'Taupe',
    colorHex: '#83695C',
    feeling: 'A slow, sensual calm that fills the room.',
    accord: 'Jasmine & ylang-ylang · Lily of the valley · Amber',
    notes: ['Jasmine', 'Ylang-ylang', 'Lily of the valley', 'Amber'],
    labelNotes: 'Jasmine, Ylang-Ylang & Amber',
    description:
      'Healing begins with a light floral brightness before deepening into the soft richness of jasmine and ylang-ylang. The base is warm and creamy, leaving behind a peaceful, lingering softness.',
    why:
      'The collection’s floral — soft and enveloping rather than sharp, made for slower moments.',
    mood: ['Restored', 'Soft', 'Present'],
    perfectFor: ['Bath time', 'Reflection', 'Quiet evenings alone'],
    status: 'waitlist',
    image: null,
    diffuserStatus: 'waitlist',
    diffuserImage: null,
  },
  {
    slug: 'quiet-the-noise',
    number: '04',
    name: 'Quiet the Noise',
    tone: 'stone',
    colorName: 'Stone grey',
    colorHex: '#686B68',
    feeling: 'A gentle exhale at the end of a long day.',
    accord: 'Lavender & chamomile · Neroli · White musk',
    notes: ['Lavender', 'Chamomile', 'Neroli', 'White musk'],
    labelNotes: 'Lavender, Chamomile & Neroli',
    description:
      'Quiet the Noise opens with a soft, airy freshness before settling into lavender and chamomile. As the fragrance settles, a warm, clean musky base slowly emerges, wrapping the room in a sense of stillness.',
    why:
      'An evening fragrance — familiar, clean and unhurried, for the hour when the day is finally done.',
    mood: ['Calm', 'Rested', 'Clear'],
    perfectFor: ['Evenings', 'Journaling', 'Winding down'],
    status: 'waitlist',
    image: null,
    diffuserStatus: 'waitlist',
    diffuserImage: null,
  },
  {
    slug: 'balance',
    number: '05',
    name: 'Balance',
    tone: 'charcoal',
    colorName: 'Charcoal',
    colorHex: '#3A3937',
    feeling: 'Clean without being sharp. Fresh without being cold.',
    accord: 'Bergamot & eucalyptus · Vetiver · Soft woods',
    notes: ['Bergamot', 'Eucalyptus', 'Vetiver', 'Soft woods'],
    labelNotes: 'Bergamot, Eucalyptus & Vetiver',
    description:
      'Bright bergamot opens the fragrance, followed by cool, clean eucalyptus. A soft woody base of vetiver anchors it, creating harmony between energy and calm.',
    why:
      'The collection’s daytime fragrance — crisp and composed, made for the start of the day.',
    mood: ['Focused', 'Clear', 'Centred'],
    perfectFor: ['Mornings', 'Workspaces', 'Fresh starts'],
    status: 'waitlist',
    image: null,
    diffuserStatus: 'waitlist',
    diffuserImage: null,
  },
];

export function productBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function statusOf(product, format = 'candle') {
  return format === 'diffuser' ? product.diffuserStatus : product.status;
}

export function imageOf(product, format = 'candle') {
  return format === 'diffuser' ? product.diffuserImage : product.image;
}

export function formatPrice(amount = PRICE_KES) {
  return `KSh ${amount.toLocaleString('en-KE')}`;
}
