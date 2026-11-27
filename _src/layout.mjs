// Shared layout pieces for every SocietalPro page.

export const SITE = {
  name: 'SocietalPro',
  url: 'https://societalpro.com',
  app: 'https://app.societalpro.com',
  blog: 'https://blog.societalpro.com',
  email: 'support@societalpro.com',
  whatsapp: '+91 74000 43868',
  whatsappLink: 'https://wa.me/917400043868',
  tagline: 'Honest societies. Honest country.',
};

export const TOOLS = [
  { slug: 'openness-score', icon: 'fa-circle-check', name: 'Society Openness Score', short: 'Eight quick questions on payments, records, voting and reporting.' },
  { slug: 'maintenance-split', icon: 'fa-calculator', name: 'Maintenance Split Calculator', short: 'A fair per-flat amount, equal or by area.' },
  { slug: 'late-fee', icon: 'fa-receipt', name: 'Late Fee Calculator', short: 'Estimate interest on overdue dues, with a polite reminder.' },
  { slug: 'monthly-accounts', icon: 'fa-file-invoice', name: 'Monthly Accounts Template', short: 'A simple income and expense report to share with members.' },
  { slug: 'agm-checklist', icon: 'fa-list-check', name: 'AGM Questions Checklist', short: '10 questions every member should ask at the AGM.' },
  { slug: 'meeting-notice', icon: 'fa-file-lines', name: 'Meeting Notice & Minutes', short: 'Generate a clear notice and minutes, ready to print.' },
  { slug: 'quorum', icon: 'fa-check-to-slot', name: 'Voting Quorum Calculator', short: 'Check whether a meeting and a resolution are valid.' },
  { slug: 'visitor-register', icon: 'fa-clipboard-list', name: 'Visitor Register Template', short: 'A printable gate register, with privacy in mind.' },
];

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function head(meta) {
  const title = meta.title ? `${meta.title} | SocietalPro` : `SocietalPro | ${SITE.tagline}`;
  const desc = meta.description || 'SocietalPro is the society management platform that puts every payment, decision and action on record, so nothing is hidden and trust doesn’t depend on any one person.';
  const canonical = SITE.url + '/' + (meta.out || '').replace(/index\.html$/, '');
  return `<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <link rel="canonical" href="${canonical}">
    ${meta.noindex ? '<meta name="robots" content="noindex">' : ''}
    <meta name="theme-color" content="#0B7F70">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="SocietalPro">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${SITE.url}/logo/main-stacked-logo.png">
    <meta name="twitter:card" content="summary">

    <link rel="icon" type="image/png" sizes="32x32" href="/logo/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/logo/favicon-16x16.png">
    <link rel="apple-touch-icon" href="/logo/android-chrome-192x192.png">
    <link rel="manifest" href="/site.webmanifest">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Source+Serif+4:ital,wght@0,500;0,600;1,500&display=swap">

    <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="/assets/css/fontawesome.css">
    <link rel="stylesheet" href="/assets/css/animate.css">
    <link rel="stylesheet" href="/assets/css/swiper.min.css">
    <link rel="stylesheet" href="/assets/css/odometer.css">
    <link rel="stylesheet" href="/assets/css/nice-select.css">
    <link rel="stylesheet" href="/assets/css/magnific-popup.css">
    <link rel="stylesheet" href="/assets/css/main.css">
    <link rel="stylesheet" href="/assets/css/societalpro.css">
</head>`;
}

function btn(label, href, variant = '', extra = '') {
  return `<a class="thm-btn desk-btn ${variant}" data-split-link="" aria-label="${esc(label)}" href="${href}"${extra}>
                                <div class="inner"><div class="text" data-link-shadow="">${label}</div></div>
                            </a>`;
}
export { btn };

export function header(active) {
  const li = (key, href, label, ext = false) =>
    `<li class="${active === key ? 'active' : ''}"><a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}><span>${label}</span></a></li>`;
  const toolsSub = TOOLS.map((t) => `<li><a href="/free-tools/${t.slug}/"><span>${t.name}</span></a></li>`).join('\n');
  return `        <header id="xb-header-area" class="header-area header-area--two header-transparent is-sticky">
            <div class="xb-header stricky">
                <div class="container-fluid p-0">
                    <div class="header__wrap ul_li_between mlr-50">
                        <div class="xb-header-logo">
                            <a href="/" class="logo" aria-label="SocietalPro home"><img src="/logo/main-long-logo.png" alt="SocietalPro" width="190" height="34"></a>
                        </div>
                        <div class="main-menu__wrap navbar navbar-expand-lg p-0">
                            <nav class="main-menu collapse navbar-collapse">
                                <ul>
                                    ${li('product', '/#product', 'Product')}
                                    ${li('habit', '/#habit', 'How it works')}
                                    ${li('pricing', '/pricing/', 'Pricing')}
                                    <li class="menu-item-has-children ${active === 'tools' ? 'active' : ''}"><a href="/free-tools/"><span>Free tools</span></a>
                                        <ul class="submenu">
                                            <li><a href="/free-tools/"><span>All free tools</span></a></li>
                                            ${toolsSub}
                                        </ul>
                                    </li>
                                    ${li('about', '/manifesto/', 'About')}
                                    ${li('blog', SITE.blog, 'Blog', true)}
                                    ${li('contact', '/contact/', 'Contact')}
                                </ul>
                            </nav>
                        </div>
                        <div class="xb-header-btn">
                            ${btn('Book a free demo', '/contact/', 'desk-btn--white')}
                            ${btn('Open your society', SITE.app)}
                        </div>
                        <div class="header-bar-mobile side-menu d-lg-none">
                            <a class="xb-nav-mobile" href="javascript:void(0);" aria-label="Open menu"><span></span><span></span><span></span></a>
                        </div>
                    </div>
                    <div class="xb-header-wrap">
                        <div class="xb-header-menu">
                            <div class="xb-header-menu-scroll">
                                <div class="xb-menu-close xb-hide-xl xb-close"></div>
                                <div class="xb-logo-mobile xb-hide-xl">
                                    <a href="/" rel="home"><img src="/logo/main-long-logo.png" alt="SocietalPro" width="170"></a>
                                </div>
                                <nav class="xb-header-nav">
                                    <ul class="xb-menu-primary clearfix">
                                        <li class="menu-item"><a href="/"><span>Home</span></a></li>
                                        <li class="menu-item"><a href="/#product"><span>Product</span></a></li>
                                        <li class="menu-item"><a href="/#habit"><span>How it works</span></a></li>
                                        <li class="menu-item"><a href="/pricing/"><span>Pricing</span></a></li>
                                        <li class="menu-item menu-item-has-children"><a href="/free-tools/"><span>Free tools</span></a>
                                            <ul class="sub-menu">
                                                <li><a href="/free-tools/"><span>All free tools</span></a></li>
                                                ${toolsSub}
                                            </ul>
                                        </li>
                                        <li class="menu-item"><a href="/manifesto/"><span>About</span></a></li>
                                        <li class="menu-item"><a href="${SITE.blog}" target="_blank" rel="noopener"><span>Blog</span></a></li>
                                        <li class="menu-item"><a href="/contact/"><span>Contact</span></a></li>
                                    </ul>
                                </nav>
                                <div class="sp-mobile-ctas">
                                    <a class="sp-btn sp-btn--amber w-100" href="${SITE.app}">Open your society</a>
                                    <a class="sp-btn sp-btn--ghost w-100" href="/contact/">Book a free demo</a>
                                </div>
                            </div>
                        </div>
                        <div class="xb-header-menu-backdrop"></div>
                    </div>
                </div>
            </div>
        </header>`;
}

export function ctaBlock(cta = {}) {
  const title = cta.title || 'Start with your society.';
  const text = cta.text || 'Put payments, decisions and everyday work on record. Nothing hidden. Everything sorted.';
  return `
            <section class="cta cta-section pt-130">
                <div class="container">
                    <div class="xb-cta-wrapper sp-cta-wrapper">
                        <div class="row mt-none-70 align-items-end">
                            <div class="col-lg-6 mt-70">
                                <div class="xb-cta-left">
                                    <div class="sec-title sec-title--two">
                                        <h2 class="title clr-white">${title}</h2>
                                    </div>
                                    <p class="xb-content clr-white">${text}</p>
                                    <div class="xb-cta-btn ul_li">
                                        ${btn('Open your society', SITE.app, 'desk-btn--amber')}
                                        <a class="sp-link-white" href="/contact/">or book a free demo <i class="far fa-arrow-right"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6 mt-70">
                                <div class="sp-phone-wrap" aria-hidden="true">
                                    <div class="sp-phone">
                                        <div class="sp-phone__notch"></div>
                                        <div class="sp-phone__screen">
                                            <div class="sp-phone__head">
                                                <img src="/logo/favicon-32x32.png" alt="" width="22" height="22">
                                                <span>Green Park CHS</span>
                                            </div>
                                            <p class="sp-phone__label">This month, on record</p>
                                            <p class="sp-phone__total">₹4,82,500</p>
                                            <p class="sp-phone__muted">Sample figures</p>
                                            <ul class="sp-phone__list">
                                                <li><span class="dot dot--green"></span><div><strong>B-204 paid ₹2,500</strong><small>Note: October maintenance</small></div></li>
                                                <li><span class="dot dot--teal"></span><div><strong>Water tank repair ₹38,000</strong><small>Approval note attached</small></div></li>
                                                <li><span class="dot dot--amber"></span><div><strong>Lift AMC renewal</strong><small>Voting open · 42 of 60 flats</small></div></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="sp-float sp-float--1"><i class="fa-brands fa-whatsapp"></i> Payment update sent</div>
                                    <div class="sp-float sp-float--2"><i class="fa-solid fa-check-to-slot"></i> One flat, one vote</div>
                                    <div class="sp-float sp-float--3"><i class="fa-brands fa-telegram"></i> Request logged</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;
}

export function footer() {
  const year = new Date().getFullYear();
  return `        <footer class="footer mlr-50">
            <div class="hd-footer-wrapper sp-footer-wrapper radius-50 mb-50">
                <div class="container">
                    <div class="hd-footer-inner">
                        <div class="xb-footer-contact">
                            <div class="row mt-none-10">
                                <div class="col-lg-4 col-md-4 mt-10">
                                    <div class="xb-contact-item">
                                        <div class="xb-icon ul_li"><span class="sp-ico"><i class="fa-solid fa-envelope"></i></span> Email support</div>
                                        <h3 class="contact-method"><a href="mailto:${SITE.email}">${SITE.email}</a></h3>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-4 mt-10">
                                    <div class="xb-contact-item">
                                        <div class="xb-icon ul_li"><span class="sp-ico"><i class="fa-brands fa-whatsapp"></i></span> WhatsApp</div>
                                        <h3 class="contact-method"><a href="${SITE.whatsappLink}" target="_blank" rel="noopener">${SITE.whatsapp}</a></h3>
                                    </div>
                                </div>
                                <div class="col-lg-4 col-md-4 mt-10">
                                    <div class="xb-contact-item">
                                        <div class="xb-icon ul_li"><span class="sp-ico"><i class="fa-solid fa-calendar-check"></i></span> See it working</div>
                                        <h3 class="contact-method"><a href="/contact/">Book a free demo</a></h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="sp-footer-main">
                            <div class="row mt-none-30">
                                <div class="col-lg-5 mt-30">
                                    <a href="/" class="sp-footer-logo"><img src="/logo/main-long-logo.png" alt="SocietalPro" width="230"></a>
                                    <p class="sp-footer-belief">Honest societies build an honest country. Start with yours.</p>
                                    <p class="sp-footer-small">A private, non-partisan platform for housing societies. Payments processed securely via Razorpay.</p>
                                </div>
                                <div class="col-lg-2 col-6 mt-30">
                                    <h4 class="sp-footer-title">Explore</h4>
                                    <ul class="sp-footer-links list-unstyled">
                                        <li><a href="/#product">Product</a></li>
                                        <li><a href="/#habit">How it works</a></li>
                                        <li><a href="/pricing/">Pricing</a></li>
                                        <li><a href="/free-tools/">Free tools</a></li>
                                    </ul>
                                </div>
                                <div class="col-lg-2 col-6 mt-30">
                                    <h4 class="sp-footer-title">Company</h4>
                                    <ul class="sp-footer-links list-unstyled">
                                        <li><a href="/manifesto/">Our belief</a></li>
                                        <li><a href="/contact/">Contact</a></li>
                                        <li><a href="${SITE.blog}" target="_blank" rel="noopener">Blog</a></li>
                                        <li><a href="${SITE.app}">Open your society</a></li>
                                    </ul>
                                </div>
                                <div class="col-lg-3 col-12 mt-30">
                                    <h4 class="sp-footer-title">Popular tools</h4>
                                    <ul class="sp-footer-links list-unstyled">
                                        <li><a href="/free-tools/openness-score/">Society Openness Score</a></li>
                                        <li><a href="/free-tools/maintenance-split/">Maintenance split</a></li>
                                        <li><a href="/free-tools/late-fee/">Late fee calculator</a></li>
                                        <li><a href="/free-tools/agm-checklist/">AGM questions checklist</a></li>
                                    </ul>
                                </div>
                            </div>
                            <p class="sp-footer-disclaimer">For guidance only. Check your society’s bye-laws and local regulations.</p>
                        </div>

                        <div class="xb-footer_bottom hd-footer-bottom ul_li_between">
                            <p>© ${year} <a href="/">SocietalPro</a>. All rights reserved.</p>
                            <ul class="xb-social-media list-unstyled ul_li">
                                <li><a href="mailto:${SITE.email}" aria-label="Email"><i class="fa-solid fa-envelope"></i></a></li>
                                <li><a href="${SITE.whatsappLink}" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a></li>
                            </ul>
                            <p><a href="/terms/">Terms of service</a> · <a href="/privacy/">Privacy policy</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>`;
}

export function scripts(extra) {
  const base = [
    'jquery-3.7.1.min.js', 'bootstrap.bundle.min.js', 'swiper.min.js', 'wow.min.js', 'appear.js',
    'imagesloaded.pkgd.min.js', 'isotope.pkgd.min.js', 'jquery.nice-select.min.js', 'jquery.marquee.min.js',
    'jquery.magnific-popup.min.js', 'odometer.min.js', 'parallaxie.js', 'parallax.min.js', 'parallax-scroll.js',
    'easing.min.js', 'scrollspy.js', 'plugin.js', 'lenis.js', 'main.js', 'societalpro.js',
  ];
  return [...base, ...extra].map((s) => `    <script src="/assets/js/${s}"></script>`).join('\n');
}
