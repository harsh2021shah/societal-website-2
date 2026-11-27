// SocietalPro static site builder.
// Usage: node _src/build.mjs
// Reads every _src/pages/**/*.html file, wraps it in the shared layout
// (header, CTA, footer, scripts) and writes the result to the repo root.
// Each page starts with a JSON header comment:  <!--{ "title": "...", "out": "pricing/index.html", ... }-->

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, TOOLS, header, footer, ctaBlock, head, scripts, btn } from './layout.mjs';
import { pricingCards, compareTable, faqList, faqSchema, toolCards } from './data.mjs';

function pageHero({ title, lead = '', crumbs = [] }) {
  const c = crumbs.length
    ? `<div class="sp-crumbs"><a href="/">Home</a>${crumbs.map(([l, h]) => ` <span>/</span> ${h ? `<a href="${h}">${l}</a>` : `<span>${l}</span>`}`).join('')}</div>`
    : '';
  return `
        <section class="breadcrumb sp-page-hero pos-rel z-1">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-9">
                        <div class="breadcrumb--wrap text-center">
                            ${c}
                            <h1 class="breadcrumb--title xbFadeUpItem" data-animation-delay="0ms">${title}</h1>
                            ${lead ? `<p class="sp-lead xbFadeUpContent" data-animation-delay="100ms">${lead}</p>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <span class="sp-hero-shape sp-hero-shape--1"></span>
            <span class="sp-hero-shape sp-hero-shape--2"></span>
        </section>`;
}

function toolFooter(slug, nextTitle, nextText) {
  return `
                <div class="sp-disclaimer"><i class="fa-solid fa-circle-info"></i><div>For guidance only. Check your society’s bye-laws and local regulations.</div></div>
                <div class="sp-tool-next">
                    <div><h3>${nextTitle}</h3><p>${nextText}</p></div>
                    ${btn('Open your society', SITE.app, 'desk-btn--amber')}
                </div>
                <div class="mt-60">
                    <h3 class="mb-20" style="font-size:22px">More free tools</h3>
                    <div class="row mt-none-20">${toolCards(slug)}</div>
                </div>`;
}

function expand(s) {
  return s
    .replace(/\{\{pricingCards\}\}/g, () => pricingCards())
    .replace(/\{\{compareTable\}\}/g, () => compareTable())
    .replace(/\{\{faq:(\w+)\}\}/g, (_, k) => faqList(k))
    .replace(/\{\{faqSchema:(\w+)\}\}/g, (_, k) => faqSchema(k))
    .replace(/\{\{hero (\{[\s\S]*?\})\s*\}\}/g, (_, j) => pageHero(JSON.parse(j)))
    .replace(/\{\{toolHero:([\w-]+)\}\}/g, (_, slug) => {
      const t = TOOLS.find((x) => x.slug === slug);
      return pageHero({ title: t.name, lead: t.short, crumbs: [['Free tools', '/free-tools/'], [t.name]] });
    })
    .replace(/\{\{toolFooter:([\w-]+)\|([^|]*)\|([^}]*)\}\}/g, (_, slug, a, b) => toolFooter(slug, a, b))
    .replace(/\{\{toolGrid\}\}/g, () => TOOLS.map((t, i) => `
                        <div class="col-lg-4 col-md-6 mt-30">
                            <a class="sp-tool-card" href="/free-tools/${t.slug}/">
                                <span class="sp-tool-tag">${i < 3 || t.slug === 'quorum' ? 'Calculator' : t.slug === 'openness-score' ? 'Quiz' : 'Template'}</span>
                                <div class="ico"><i class="fa-solid ${t.icon}"></i></div>
                                <h3>${t.name}</h3>
                                <p>${t.short}</p>
                                <span class="go">Open tool <i class="far fa-arrow-right"></i></span>
                            </a>
                        </div>`).join(''));
}

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const pagesDir = join(here, 'pages');

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });
}

const sitemap = [];
for (const file of walk(pagesDir)) {
  const raw = readFileSync(file, 'utf8');
  const m = raw.match(/^<!--(\{[\s\S]*?\})-->\s*/);
  if (!m) throw new Error(`Missing JSON header in ${file}`);
  const meta = JSON.parse(m[1]);
  const body = expand(raw.slice(m[0].length));
  const out = meta.out;

  let html;
  if (meta.raw) {
    html = body; // page provides its own full document (e.g. redirect)
  } else {
    html = `<!doctype html>
<html lang="en">
${head(meta)}
<body class="help-desk sp-site${meta.bodyClass ? ' ' + meta.bodyClass : ''}">
    <div class="xb-backtotop"><a href="#" class="scroll" aria-label="Back to top"><i class="far fa-arrow-up"></i></a></div>
    <div id="preloader" class="xb-loader">
        <div class="xb-loader-inner"><div class="xb-loader-logo"><img src="/logo/main-stacked-logo.png" alt="SocietalPro" width="120"></div></div>
    </div>
    <div class="body_wrap">
${header(meta.nav || '')}
        <div class="body-overlay"></div>
        <main>
${body}
${meta.noCta ? '' : ctaBlock(meta.cta)}
        </main>
${footer()}
    </div>
${scripts(meta.scripts || [])}
</body>
</html>
`;
  }
  const target = join(root, out);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
  if (!meta.noindex && !meta.raw) {
    sitemap.push(SITE.url + '/' + out.replace(/index\.html$/, ''));
  }
  console.log('built', relative(root, target));
}

writeFileSync(
  join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.sort().map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`
);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
console.log('built sitemap.xml, robots.txt');
