import { layout, esc, pageHero } from '../lib/layout.js';
import { faqs } from '../data/faqs.js';
import { site } from '../site.config.js';

export default function contact() {
  const faqHtml = faqs
    .map(
      (group) => `<div class="faq-group">
      <h3>${esc(group.group)}</h3>
      ${group.items
        .map((item) => `<details class="disclosure"><summary>${esc(item.q)}</summary><p>${item.a}</p></details>`)
        .join('')}
    </div>`,
    )
    .join('');

  const body = `
${pageHero({
  eyebrow: 'Contact',
  title: 'We would love to hear from you.',
  lede: `Questions about the collection, gifting, collaborations or anything else — send us a note and we will reply personally.${
    site.email ? ` You can also email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.` : ''
  }`,
})}

<section class="section section-tight" id="contact-form">
  <div class="container narrow">
    <form class="form form-card" data-endpoint="/api/contact" novalidate>
      <div class="field-row">
        <div class="field">
          <label for="ct-name">Your name</label>
          <input id="ct-name" name="name" type="text" autocomplete="name" required maxlength="120">
        </div>
        <div class="field">
          <label for="ct-email">Email address</label>
          <input id="ct-email" name="email" type="email" autocomplete="email" required maxlength="254">
        </div>
      </div>
      <div class="field">
        <label for="ct-topic">What is it about?</label>
        <select id="ct-topic" name="topic">
          <option value="General">A general question</option>
          <option value="The collection">The collection</option>
          <option value="Gifting or corporate orders">Gifting or corporate orders</option>
          <option value="Collaboration or press">Collaboration or press</option>
          <option value="Stockists">Becoming a stockist</option>
        </select>
      </div>
      <div class="field">
        <label for="ct-message">Message</label>
        <textarea id="ct-message" name="message" rows="6" required maxlength="4000"></textarea>
      </div>
      <div class="field field-hidden" aria-hidden="true">
        <label for="ct-company">Leave this field empty</label>
        <input id="ct-company" name="company" type="text" tabindex="-1" autocomplete="off">
      </div>
      <p class="small">We use your details only to reply to your message. See our <a href="/privacy">privacy policy</a>.</p>
      <button class="button" type="submit">Send message</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
    <p class="small center support-pointer">This inbox is not monitored around the clock. If you are in distress or need urgent support, please see our <a href="/purpose#support">support page</a>.</p>
  </div>
</section>

<section class="section section-soft" id="faq" aria-labelledby="faq-title">
  <div class="container narrow">
    <div class="section-head"><p class="eyebrow">FAQs</p><h2 id="faq-title">Frequently asked questions.</h2></div>
    ${faqHtml}
  </div>
</section>`;

  return layout({
    path: '/contact',
    title: 'Contact & FAQs',
    description: 'Contact RORO LUX and find answers about orders, delivery, returns, candle care and ingredients.',
    body,
    nav: 'contact',
  });
}
