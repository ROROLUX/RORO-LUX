import { layout, pageHero } from '../lib/layout.js';
import { site } from '../site.config.js';

// Support lines checked against Befrienders Worldwide, Lifeline International
// and Find A Helpline listings in October 2026. Re-check every number before
// launch and at least every six months — helpline details change.
const supportLines = [
  {
    name: 'Emergency services (Kenya)',
    detail: 'Call <a href="tel:999">999</a> or <a href="tel:112">112</a> if you or someone else is in immediate danger.',
  },
  {
    name: 'Befrienders Kenya',
    detail:
      'Free, confidential emotional support for anyone feeling distressed, lonely or having thoughts of suicide. Call, SMS or WhatsApp <a href="tel:+254722178177">+254 722 178 177</a>.',
  },
  {
    name: 'Childline Kenya',
    detail: 'Free support for children and young people, 24 hours a day. Call <a href="tel:116">116</a>.',
  },
  {
    name: 'Find A Helpline',
    detail:
      'An up-to-date directory of free, confidential helplines in Kenya and worldwide: <a href="https://findahelpline.com/countries/ke" rel="noopener" target="_blank">findahelpline.com</a>.',
  },
];

export default function purpose() {
  const body = `
${pageHero({
  eyebrow: 'Our Purpose',
  title: 'Mental health deserves the same seriousness, attention and care as physical health.',
  lede: 'Mental-health awareness is part of who RORO LUX is — not a marketing line. This is what we believe, what we intend to do, and what we will not claim.',
})}

<section class="section section-tight">
  <div class="container narrow prose">
    <p>We want to contribute to a culture in which people feel more comfortable acknowledging difficult emotions, talking about their experiences, and seeking appropriate support when they need it.</p>
    <p>Our products are one part of that. Our advocacy is meant to reach further — to people who may never buy a candle, but who deserve to hear that their wellbeing matters.</p>
  </div>
</section>

<section class="section section-soft">
  <div class="container">
    <div class="section-head"><p class="eyebrow">What we intend to do</p><h2>Our awareness commitments.</h2>
    <p>We are at the beginning. These are the initiatives we are working towards, in the order we can responsibly deliver them.</p></div>
    <ol class="values">
      <li><h3>Educational content</h3><p>Clear, compassionate social media content about emotional wellbeing and the stigma that still surrounds mental health.</p></li>
      <li><h3>Reflective prompts</h3><p>Simple prompts and self-care resources that invite people to pause and check in with themselves. <a href="/journal/a-ten-minute-evening-ritual">Start with our evening ritual</a>.</p></li>
      <li><h3>Storytelling</h3><p>Stories that help normalise conversations about stress, loneliness, grief and healing.</p></li>
      <li><h3>Qualified partners</h3><p>Future collaborations with qualified mental-health professionals and credible organisations, so that what we share is accurate and responsible.</p></li>
      <li><h3>Giving back</h3><p>Contributions to mental-health initiatives as the business becomes financially sustainable. We will publish what we give, and to whom, when we begin.</p></li>
    </ol>
  </div>
</section>

<section class="section">
  <div class="container split">
    <div>
      <p class="eyebrow">Our role, honestly</p>
      <h2>What a candle can — and cannot — do.</h2>
    </div>
    <div class="prose">
      <p>RORO LUX is not a therapy provider, and our candles are not a treatment for depression, anxiety, trauma or any other mental-health condition. We will never present them as a substitute for professional care.</p>
      <p>What a candle can offer is smaller and still worthwhile: a cue to pause, a fragrance that becomes part of a ritual, a way of marking time for yourself. We design for those moments — and point clearly towards real support for everything beyond them.</p>
      <p>We will also be careful with facts. Any statistic we publish about mental health will be checked against its original source and cited, because a brand built on trust cannot afford to be careless with the truth.</p>
    </div>
  </div>
</section>

<section class="section section-soft" id="support" aria-labelledby="support-title">
  <div class="container narrow">
    <div class="support-box">
      <p class="eyebrow">If you need support</p>
      <h2 id="support-title">You do not have to carry it alone.</h2>
      <p>If you are struggling, please reach out to someone you trust, a doctor, or one of the free services below.</p>
      <ul class="support-list">
        ${supportLines.map((s) => `<li><h3>${s.name}</h3><p>${s.detail}</p></li>`).join('')}
      </ul>
      <p class="small">RORO LUX is not affiliated with these organisations. Details were last checked in October 2026; services and hours can change.</p>
    </div>
  </div>
</section>
`;
  return layout({
    path: '/purpose',
    title: 'Our Purpose',
    description: `RORO LUX and mental-health awareness: what we believe, what we intend to do, and where to find support in ${site.country}.`,
    body,
    nav: 'purpose',
  });
}
