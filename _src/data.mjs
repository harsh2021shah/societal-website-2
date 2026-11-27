// Content shared by several pages. Edit prices here, then run: node _src/build.mjs
import { SITE, TOOLS } from './layout.mjs';

export const PLANS = [
  {
    name: 'Small', for: 'Fewer than 100 residents', monthly: '₹3,999', setup: '₹7,999',
    text: '50,000', voice: '5,000',
  },
  {
    name: 'Medium', for: '100–500 residents', monthly: '₹6,499', setup: '₹15,999',
    text: '1,00,000', voice: '10,000', featured: true,
  },
  {
    name: 'Large', for: 'More than 500 residents', monthly: '₹10,999', setup: '₹32,999',
    text: '2,00,000', voice: '50,000',
  },
];

const COMMON_FEATURES = [
  'Payments with required notes',
  'Activity history (who and when)',
  'Voting and recorded decisions',
  'Monthly reports for residents',
  'WhatsApp payment updates',
  'AI voice requests on Telegram',
];

export function pricingCards() {
  return PLANS.map((p) => `
                        <div class="col-lg-4 col-md-6 mt-30">
                            <div class="sp-price-card${p.featured ? ' featured' : ''}">
                                ${p.featured ? '<span class="sp-price-tag">Most societies</span>' : ''}
                                <div class="sp-price-name">${p.name}</div>
                                <div class="sp-price-for">${p.for}</div>
                                <div class="sp-price-amt">${p.monthly}<small> /month</small></div>
                                <div class="sp-price-setup">+ ${p.setup} one-time setup fee</div>
                                <ul class="sp-price-list list-unstyled">
                                    <li><i class="fa-solid fa-check"></i> <span><b>${p.text}</b> text credits / month</span></li>
                                    <li><i class="fa-solid fa-check"></i> <span><b>${p.voice}</b> voice credits / month</span></li>
                                    ${COMMON_FEATURES.slice(0, 4).map((f) => `<li><i class="fa-solid fa-check"></i> <span>${f}</span></li>`).join('\n                                    ')}
                                </ul>
                                <a class="sp-btn ${p.featured ? 'sp-btn--amber' : ''} w-100" href="${SITE.app}">Choose ${p.name}</a>
                            </div>
                        </div>`).join('');
}

export function compareTable() {
  const rows = [
    ['Residents', ...PLANS.map((p) => p.for)],
    ['Monthly subscription', ...PLANS.map((p) => p.monthly)],
    ['One-time setup', ...PLANS.map((p) => p.setup)],
    ['Text credits / month', ...PLANS.map((p) => p.text)],
    ['Voice credits / month', ...PLANS.map((p) => p.voice)],
    ...COMMON_FEATURES.map((f) => [f, '<i class="fa-solid fa-check"></i>', '<i class="fa-solid fa-check"></i>', '<i class="fa-solid fa-check"></i>']),
    ['Visitor logs (Secretary-only)', '<i class="fa-solid fa-check"></i>', '<i class="fa-solid fa-check"></i>', '<i class="fa-solid fa-check"></i>'],
    ['Language preferences', '<i class="fa-solid fa-check"></i>', '<i class="fa-solid fa-check"></i>', '<i class="fa-solid fa-check"></i>'],
    ['Export your records', '<i class="fa-solid fa-check"></i>', '<i class="fa-solid fa-check"></i>', '<i class="fa-solid fa-check"></i>'],
  ];
  return `<div class="sp-table-wrap"><table class="sp-compare">
                        <thead><tr><th>What’s included</th>${PLANS.map((p) => `<th>${p.name}</th>`).join('')}</tr></thead>
                        <tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('\n')}</tbody>
                    </table></div>`;
}

export const FAQ = {
  home: [
    ['What is SocietalPro?', 'SocietalPro is a society management platform for housing societies. It puts payments, decisions and everyday work on record, so residents can see where things stand and committees have proof of their honest work.'],
    ['Who is it for?', 'Secretaries, treasurers and committee members who want less paperwork and more trust, and residents who want to know where the money goes, pay easily and be heard in their own language.'],
    ['Is SocietalPro connected to any political party or the government?', '<span>No.</span> SocietalPro is a private, non-partisan company. We build tools for every society and stay out of politics.'],
    ['How do residents pay?', 'Residents pay online, and payments are processed securely via Razorpay. Every payment carries a note, so it explains itself. SocietalPro does not hold your society’s funds.'],
    ['Who can see visitor logs?', 'Visitor logs are restricted to the Secretary. Residents see what is meant for residents, the committee sees what is meant for the committee.'],
    ['Can our society take its data with us?', '<span>Yes.</span> Your records belong to your society. You can export them, because a transparency tool should never be a black box.'],
  ],
  pricing: [
    ['What are text and voice credits?', 'Credits cover messages SocietalPro sends and handles for your society, such as WhatsApp payment updates and notices (text) and AI voice requests on Telegram (voice). Allowances renew every month.'],
    ['What does the one-time setup fee cover?', 'Setting up your society: flats and members, opening balances, roles and visibility, and getting your committee comfortable with the platform.'],
    ['How do we choose the right plan?', 'Plans are based on the number of residents in your society. If you’re between sizes, or not sure, <a href="/contact/">talk to us</a> and we’ll help you pick.'],
    ['Are prices inclusive of GST?', 'Prices shown are in Indian rupees. Applicable taxes are shown at checkout.'],
    ['How are payments processed?', 'Subscription and resident payments are processed securely via Razorpay.'],
  ],
};

export function faqList(key) {
  return FAQ[key].map(([q, a], i) => `
                                        <li class="accordion block${i === 0 ? ' active-block' : ''}">
                                            <div class="acc-btn${i === 0 ? ' active' : ''}">${q}<span class="arrow"><span></span></span></div>
                                            <div class="acc_body${i === 0 ? ' current' : ''}"><div class="content"><p>${a}</p></div></div>
                                        </li>`).join('');
}

export function faqSchema(key) {
  const strip = (s) => s.replace(/<[^>]+>/g, '');
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ[key].map(([q, a]) => ({ '@type': 'Question', name: strip(q), acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
  })}</script>`;
}

export function toolCards(exclude) {
  return TOOLS.filter((t) => t.slug !== exclude).map((t) => `
                        <div class="col-lg-3 col-md-6 mt-20 sp-related"><a href="/free-tools/${t.slug}/"><i class="fa-solid ${t.icon}"></i> ${t.name}</a></div>`).join('');
}
