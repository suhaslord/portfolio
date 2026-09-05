# Portfolio verification

Reviewed September 5, 2026.

## Build and content checks

- `python scripts/build.py`: static pages generated successfully.
- `python scripts/check.py`: eight entry pages and 128 local references checked, including route targets, anchors, image descriptions and dimensions, font files, and metadata.
- `node --check js/portfolio.js` and `node --check js/theme.js`: passed.
- `git diff --check`: passed.
- Generated résumé PDF: one page, rendered and visually inspected for clipping, spacing, and readable text.
- Case-study evidence checked against public repository records. Elodin PRs #769 and #789 are merged; #805 remains open. AegisLand's Phase 10R result remains a failed holdout. The offline AbstainBench baseline is not represented as model performance.

## Browser review

The hosted GitHub Pages preview was inspected in Chromium. Responsive review used a same-origin iframe with CSS viewport widths of 320, 390, 768, 1024, and 1280 pixels; these are browser layout checks, not physical-device tests.

- Homepage: desktop and mobile composition, light and dark themes, image loading, introduction, selected work, contribution links, about section, and contact path.
- AegisLand, Voyager, AbstainBench, résumé, and the retained ECHO / FIELD page: direct navigation and mobile layout. At 320px, the AegisLand table scrolls inside its focusable region while the document stays within its viewport.
- Keyboard-controlled closest-approach slider: the 300,000 km endpoint reports a 77.0° turn; the 180,000 km default reports 94.3°.
- Play and Pause trajectory controls change state correctly. Playback starts only on request.
- Mobile navigation opens and closes, and closes after choosing Work; Escape closes it and returns focus to the menu button. Visible focus outline inspected.
- About and Contact links reach the corresponding homepage sections.
- AbstainBench's existing offline evaluation completes all 30 questions; reset works. Its perfect baseline result is expected from the label-aware pipeline check. Optional WebLLM inference was not run.

Browser review prompted fixes to screenshot cropping, small-screen diagram proportions, the narrow results-table container, and stale styles after deployment. Shared CSS and JavaScript now use content-based version parameters.

## Palette contrast

Calculated from the configured solid foreground and page-background colors:

| Theme | Main text | Secondary text | Accent text |
| --- | ---: | ---: | ---: |
| Light | 13.18:1 | 5.79:1 | 5.43:1 |
| Dark | 14.99:1 | 8.37:1 | 7.06:1 |

These measurements describe the named color pairs, not a complete accessibility certification.

## Limits

- PageSpeed Insights returned a quota error (HTTP 429). No Lighthouse score or measured Core Web Vitals is claimed.
- Reduced-motion behavior and the no-JavaScript fallback were reviewed in source. An OS-level reduced-motion session and a separate JavaScript-disabled browser session were not run.
- Safari, Firefox, assistive-technology, and physical-device testing were not performed.
- Project PR states can change after the review date; the pages link to GitHub for current status.
