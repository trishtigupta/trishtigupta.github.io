Personal portfolio built with Hugo and deployed to GitHub Pages.

Deployment options:
- GitHub Actions (recommended): see `.github/workflows/hugo.yaml`.
- Or set `publishDir = "docs"` and deploy from the `docs/` folder via Pages settings.

## Front Page Albums

The front-page gallery now supports albums per tile:

- Page bundle images: Put multiple images alongside `index.md` in a bundle folder, e.g. `content/art/summer-meadow/` with `index.md` and images. These are automatically included in the album. The first image is used for the tile thumbnail.
- Front matter list: Alternatively, set a list under `images` in front matter:

```yaml
---
title: "My Album"
images:
	- "/images/album/img1.jpg"
	- "https://example.com/img2.jpg"
	- "/images/album/img3.jpg"
---
```

Interaction:
- Click a tile to open the lightbox.
- Use arrows, keyboard (←/→, Esc), or swipe on touch to navigate.

Fallbacks:
- If only a single `image` param is provided, it will open as a single-image lightbox.

Ordering:
- Page bundle images are ordered automatically by leading numeric filename prefix (e.g. `01_cover.jpg`, `02-detail.png`, `10-wide.jpg`). Files without a leading number appear after numbered files and are sorted by name.
- For front matter `images:` lists, the order is exactly as listed.

## Resume PDF

Add or replace your resume at `static/files/resume.pdf`.

Front matter on the about page (`content/about/index.md`):

```yaml
resume: "/files/resume.pdf"
```

Template auto-adds an icon link that opens in a new tab and triggers download. Replace the PDF anytime; Hugo will update the link on next build.

## Favicon

- Current dummy icon lives at `static/favicon.svg`.
- Update it by replacing that file with your own SVG (recommended) or add PNG/ICO variants and update links in `layouts/_default/baseof.html`.

Tips:
- SVG favicons: keep `viewBox` square (e.g. 64x64), simple shapes/text.
- PNG favicons: common sizes are 32x32 and 180x180 (Apple touch).
- After replacing the icon, rebuild and hard-refresh the browser.

## Anti-scraping & AI opt-out

- `static/robots.txt` blocks common AI training bots (e.g., `GPTBot`, `Google-Extended`, `CCBot`, `ClaudeBot`, `Bytespider`) while allowing mainstream search crawlers (`Googlebot`, `Bingbot`, etc.) for SEO.
- Optional `static/ai.txt` declares policy (no AI training/datasets). Some vendors read this in addition to `robots.txt`.

Adjusting policies:
- To allow or block a crawler, edit `static/robots.txt` user-agent sections.
- Keep `Sitemap: /sitemap.xml` so search engines discover your sitemap.
- GitHub Pages doesn’t support custom HTTP headers (like `X-Robots-Tag`), so use `robots.txt` and meta tags.

Rebuild:
```powershell
hugo
```
