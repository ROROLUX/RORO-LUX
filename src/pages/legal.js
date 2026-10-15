import { layout, esc, pageHero } from '../lib/layout.js';
import { site } from '../site.config.js';

// Plain-language privacy notice written with Kenya's Data Protection Act, 2019
// in mind. Have it reviewed by a qualified adviser before launch, and update it
// when payments, analytics or delivery partners are added.
export function privacy() {
  const contactLine = site.email
    ? `email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> or use our <a href="/contact">contact form</a>`
    : `use our <a href="/contact">contact form</a>`;

  const body = `
${pageHero({ eyebrow: 'Privacy', title: 'Privacy policy.', lede: `Last updated ${esc(site.privacyUpdated)}.` })}
<section class="section section-tight">
  <div class="container narrow prose">
    <p>${esc(site.legalName)} (“RORO LUX”, “we”, “us”) respects your privacy. This policy explains what personal data we collect through this website, why, and the choices you have. We process personal data in line with Kenya’s Data Protection Act, 2019.</p>

    <h2>What we collect</h2>
    <ul>
      <li><strong>Waitlist:</strong> your email address, and optionally your first name and the fragrance you are most interested in, together with a record of your consent and when you gave it.</li>
      <li><strong>Contact form:</strong> your name, email address, the topic you choose and your message.</li>
      <li><strong>Technical data:</strong> our hosting provider, Cloudflare, processes standard technical information such as IP addresses to deliver and secure the website. We do not use advertising or analytics cookies.</li>
    </ul>

    <h2>Why we use it</h2>
    <ul>
      <li>To email you about the RORO LUX launch and new fragrances, if you have joined the waitlist. Our lawful basis is your consent.</li>
      <li>To reply to messages you send us. Our lawful basis is our legitimate interest in responding to enquiries.</li>
      <li>To understand which fragrances people are most interested in, so we can plan production responsibly. We look at this in aggregate.</li>
    </ul>

    <h2>Who we share it with</h2>
    <p>We do not sell your personal data. It is stored using Cloudflare, which hosts this website, and may be processed by the email service we use to contact you. These providers act on our instructions and may store data outside Kenya, subject to appropriate safeguards.</p>

    <h2>How long we keep it</h2>
    <p>We keep waitlist details until you unsubscribe or ask us to delete them. We keep contact-form messages for as long as needed to deal with your enquiry, and no longer than two years.</p>

    <h2>Your rights</h2>
    <p>You have the right to be informed about how your data is used, to access the data we hold about you, to object to its use, and to ask us to correct or delete it. You can unsubscribe from our emails at any time using the link in any email. To exercise any of these rights, ${contactLine}.</p>
    <p>If you are not satisfied with our response, you may lodge a complaint with the Office of the Data Protection Commissioner (ODPC) in Kenya.</p>

    <h2>Changes</h2>
    <p>We will update this policy as our business grows — for example, when we begin taking orders. The date at the top shows when it last changed.</p>
  </div>
</section>`;
  return layout({ path: '/privacy', title: 'Privacy Policy', description: 'How RORO LUX collects and uses personal data.', body });
}

export function notFound() {
  const body = `
${pageHero({
  eyebrow: 'Page not found',
  title: 'This page has drifted away.',
  lede: 'The page you are looking for may have moved. Let us take you somewhere calmer.',
})}
<section class="section section-tight"><div class="container narrow center">
  <div class="actions actions-center"><a class="button" href="/">Return home</a><a class="button button-ghost" href="/collection">See the collection</a></div>
</div></section>`;
  return layout({ path: '/404', title: 'Page not found', body, noindex: true });
}
