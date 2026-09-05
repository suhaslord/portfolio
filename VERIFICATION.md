# Portfolio verification

Reviewed September 5, 2026, including the revision inspired by the user's 21 Oaks reference.

## Build and content

- `python scripts/build.py`: static pages generated successfully.
- `python scripts/check.py`: eight entry pages and 161 local references checked, including routes, anchors, image attributes, font files, and metadata.
- `node --check js/portfolio.js` and `node --check js/theme.js`: passed.
- `git diff --check`: passed.
- The existing one-page résumé PDF was retained. It was rendered and visually checked during the initial overhaul.
- The new 1200 × 630 social preview was generated and visually inspected. Earthrise and Jupiter WebP files are 106,302 and 39,952 bytes respectively; these are file sizes, not loading-time measurements.
- Public project evidence was checked: Elodin #769 and #789 are merged; #805 remains open. AegisLand's Phase 10R holdout failed its overall gates. AbstainBench's offline baseline checks the pipeline and is not model performance.
- NASA photography has visible source links and a source record. Fonts are locally hosted with licenses.

## Browser review

The hosted GitHub Pages preview was reviewed in Chromium. Responsive checks used a same-origin iframe at CSS viewport widths of 320, 390, 768, 1024, and 1280 pixels. These are browser layout checks, not physical-device tests. The iframe's scrollbar reduces its document width by 15 pixels.

- Homepage: all five widths had equal document and scroll widths, with no failed image loads. The photographic opening, scattered work index, featured project, staggered project pair, flyby, contributions, about, and contact sections were inspected.
- Image picker: click, ArrowRight, and Home changed the active image, pressed state, focus, and source credit correctly. All three full-size images loaded.
- Menu: mobile opening, Escape dismissal, and selection of Selected work were checked. Escape returned focus to the menu button with a visible solid outline. Desktop About and Get in touch links reached their sections.
- Theme: light and dark presentation reviewed; the toggle updated its pressed state.
- Flyby: keyboard End selected 300,000 km and a 77.0° turn. Play and Pause updated their pressed states. The default remains 180,000 km and 94.3°.
- AegisLand: direct navigation at 320px; the results table remains in a focusable horizontal-scroll region while the document stays within 305px. Voyager, AbstainBench, résumé, and ECHO / FIELD loaded directly at 390px with no document overflow or failed images.
- The existing AbstainBench offline evaluation completed all 30 questions and reset correctly during the initial overhaul. Its expected perfect baseline result is a label-aware pipeline check. Optional WebLLM inference was not run.

Visual review found and corrected an intrinsically wide flyby heading, the mobile Earthrise crop, and contact-label alignment. The review fixture uses revision parameters so an older cached iframe document cannot mask the current CSS. Production CSS and JavaScript also use content hashes.

## Solid-color contrast

Calculated from the configured foreground and background values:

| Theme | Main text | Secondary text | Accent text |
| --- | ---: | ---: | ---: |
| Light | 14.55:1 | 6.27:1 | 7.82:1 |
| Dark | 15.00:1 | 8.60:1 | 10.15:1 |

Dark text on the lilac action surface is 10.71:1. These measurements cover the named solid-color pairs, not every image-overlay pixel or a complete accessibility certification.

## Limits

- PageSpeed Insights returned HTTP 429 during the initial overhaul. No Lighthouse score or measured Core Web Vitals is claimed.
- Reduced-motion and no-JavaScript fallbacks were reviewed in source. OS-level reduced-motion emulation and a separate JavaScript-disabled session were not run.
- Safari, Firefox, assistive-technology, and physical-device testing were not performed.
- PR states may change after the review date; the pages link to GitHub for current status.
