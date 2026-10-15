import { layout, pageHero, waitlistForm } from '../lib/layout.js';
import { site } from '../site.config.js';

const values = [
  ['Intentionality', 'Every fragrance, name and customer interaction should have a reason behind it.'],
  ['Quality', 'Well-balanced fragrances, safe candle performance, thoughtful packaging and a premium customer experience.'],
  ['Emotional awareness', 'We create space for honest conversations about the feelings people experience.'],
  ['An accessible message', 'Luxury is our product positioning, but the message that mental health matters should reach people far beyond our customers.'],
  ['Authenticity', 'We communicate honestly about our products, our production partners, and what fragrance can and cannot do for wellbeing.'],
  ['Thoughtful growth', 'We build sustainably, putting customer trust and financial discipline ahead of rapid expansion.'],
];

export default function story() {
  const body = `
${pageHero({
  eyebrow: 'Our Story',
  title: 'More than a fragrance.',
  lede: 'At RORO LUX, we believe that the way we care for ourselves deserves intention.',
})}

<section class="section section-tight">
  <div class="container narrow prose">
    <p class="dropcap">RORO LUX began with a question: what if a scented candle could represent more than fragrance?</p>
    <p>What if it could remind someone to slow down? What if a particular scent could become part of an evening ritual, a quiet moment after a demanding day, or a thoughtful gift for someone going through a difficult season?</p>
    <p>That question became the foundation of RORO LUX.</p>
    <p>The brand draws inspiration from the emotional experiences that make us human. Healing is not always linear. Peace is not always permanent. Feeling loved, safe, grounded or appreciated can mean something different to each person. We want to give these experiences a tangible expression through fragrance.</p>
    <blockquote>Quality without excess. Beauty without pretence. Wellbeing without unrealistic promises.</blockquote>
  </div>
</section>

<section class="section section-soft">
  <div class="container split">
    <div>
      <p class="eyebrow">Why we exist</p>
      <h2>Bringing emotional wellbeing into everyday life.</h2>
    </div>
    <div class="prose">
      <p>Mental health is an essential part of human wellbeing, yet conversations about it can still feel uncomfortable, inaccessible, or easy to overlook.</p>
      <p>People navigate stress, uncertainty, loneliness, grief, emotional exhaustion and periods of change. Not everyone has access to professional support, and not everyone knows how to begin caring for their emotional wellbeing.</p>
      <p>RORO LUX was conceived as a way to bring gentle reminders of self-care into everyday environments. We believe that a moment of quiet, a familiar fragrance, a thoughtfully prepared space or a small personal ritual can help someone pause and reconnect with the present.</p>
      <p>A candle cannot treat depression, anxiety, trauma or any other mental-health condition, and we will never present it as a substitute for professional care. We create products that complement ordinary self-care, while encouraging more open conversations about mental health.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div>
      <p class="eyebrow">The founder</p>
      <h2>${site.founder}</h2>
    </div>
    <div class="prose">
      <p>RORO LUX was founded by ${site.founder} and is being built from the ground up in ${site.country} — with a vision to grow thoughtfully, earn customer trust, and expand its contribution to mental-health awareness over time.</p>
      <p>The intention is a premium brand with a gentle voice: one that values quality without excess, and treats every customer as someone whose wellbeing matters.</p>
    </div>
  </div>
</section>

<section class="section section-soft">
  <div class="container">
    <div class="statements">
      <div>
        <p class="eyebrow">Our mission</p>
        <p>To create luxurious, thoughtfully curated home fragrances that bring intention to everyday rituals while encouraging emotional awareness and conversations about mental health.</p>
      </div>
      <div>
        <p class="eyebrow">Our vision</p>
        <p>To grow into a recognised lifestyle and wellness brand that brings together premium fragrance, meaningful self-care and mental-health advocacy — beginning in Kenya and expanding beyond.</p>
      </div>
      <div>
        <p class="eyebrow">Our purpose</p>
        <p>To remind people that their emotional wellbeing matters, that rest has value, and that caring for oneself can be part of ordinary life.</p>
      </div>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head"><p class="eyebrow">What we stand for</p><h2>Our values.</h2></div>
    <ol class="values">
      ${values.map(([t, d]) => `<li><h3>${t}</h3><p>${d}</p></li>`).join('')}
    </ol>
  </div>
</section>

<section class="section section-soft" id="how-we-make">
  <div class="container split">
    <div>
      <p class="eyebrow">How our candles are made</p>
      <h2>Honest about every step.</h2>
    </div>
    <div class="prose">
      <p>RORO LUX works with specialist candle manufacturers and suppliers — including potential manufacturing partners in China — to produce our candles, develop the fragrance profiles and customise the vessels and packaging.</p>
      <p>Our own focus is fragrance selection, brand development, quality control, customer experience and mental-health advocacy. We evaluate samples before confirming any production run rather than assuming a proposed fragrance will perform as intended, and we aim to establish consistent quality before we scale.</p>
      <p>That means RORO LUX is a fragrance and wellness brand — not a claim that every candle is handmade by the founder. We think you deserve to know the difference.</p>
    </div>
  </div>
</section>

<section class="section">
  <div class="container narrow center">
    <p class="eyebrow">Looking ahead</p>
    <h2>Candles are where we begin.</h2>
    <p>In time, we hope to grow into complementary home fragrances, thoughtfully designed gift sets, a library of reflective wellness resources, and collaborations with qualified mental-health professionals and community initiatives. These are ambitions, not achievements — and we will pursue each one only when we can do it well.</p>
  </div>
</section>

${waitlistForm({ heading: 'Join us from the beginning.' })}
`;
  return layout({
    path: '/story',
    title: 'Our Story',
    description: `Why RORO LUX exists: a luxury home-fragrance brand founded by ${site.founder}, inspired by emotional wellbeing and built with honesty in ${site.country}.`,
    body,
    nav: 'story',
  });
}
