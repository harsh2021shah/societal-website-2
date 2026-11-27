# SocietalPro website: how to edit

The site is plain static HTML served by GitHub Pages at https://societalpro.com.
Pages are generated from this `_src/` folder (GitHub Pages ignores folders starting with `_`).

## Edit and rebuild

1. Edit page content in `_src/pages/` (one file per page; free tools are in `_src/pages/tools/`).
   - Header, footer and the green call-to-action band: `_src/layout.mjs`
   - Prices, plan features and FAQs: `_src/data.mjs`
2. Run `node _src/build.mjs` from the repo root. This rewrites the `.html` files, `sitemap.xml` and `robots.txt`.
3. Commit and push to `main`. GitHub Pages publishes in a minute or two.

Do not edit the generated `.html` files directly; the next build overwrites them.

## Styles and scripts

- `assets/css/main.css`: the original template theme (don't edit).
- `assets/css/societalpro.css`: SocietalPro brand colours, type and all custom components.
- `assets/js/societalpro.js`: contact form and shared helpers. **Set `WEB3FORMS_KEY` here.**
- `assets/js/tools.js`: logic for the 8 free tools (runs entirely in the browser).

## Preview locally

    python -m http.server 8765
    # open http://localhost:8765
