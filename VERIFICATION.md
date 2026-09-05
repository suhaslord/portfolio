# Portfolio verification

Reviewed September 5, 2026, including the rotating 3D project-wall revision inspired by the user's 21 Oaks reference.

## Build and content

- `python scripts/build.py`: static pages generated successfully.
- `python scripts/check.py`: eight entry pages and 181 local references checked, including routes, anchors, image attributes, font files, and metadata.
- `node --check js/portfolio.js` and `node --check js/theme.js`: passed.
- `node --check js/voyager.js` and `node --check js/aegis.js`: passed.
- `git diff --check`: passed.
- The existing one-page résumé PDF was retained. It was rendered and visually checked during the initial overhaul.
- The new 1200 × 630 social preview was generated and visually inspected. Earthrise and Jupiter WebP files are 106,302 and 39,952 bytes respectively; these are file sizes, not loading-time measurements.
- Public project evidence was checked: Elodin #769 and #789 are merged; #805 remains open. AegisLand's Phase 10R holdout failed its overall gates. AbstainBench's offline baseline checks the pipeline and is not model performance.
- Public evidence was checked for the broader index: Seagulls / OpenStage role context comes from the user's shareable work record; OpenMDAO Aviary #1262, NASA python_cmr #119, and the AIEA profile #347 are merged. The NASA 3D Resources Voyager model and Jupiter texture are credited in `assets/3d/SOURCE.md`.
- The downloaded 3D files are 285,936 bytes (Voyager model) and 225,878 bytes (Jupiter texture). These are measured repository file sizes, not loading-time or bandwidth measurements. The Voyager first-paint fallback is now an attributed NASA/JPL-Caltech archival photograph; the systems cards and project wall use real, labeled project evidence rather than CSS-only illustrations. The Seagulls mark is a measured 768 × 768 PNG at 42,578 bytes.
- NASA photography has visible source links and a source record. Fonts are locally hosted with licenses.

## Browser review

The refreshed hosted GitHub Pages page was reviewed in Chromium after the spatial-wall publication, using a 1,363 × 936 browser viewport. These are browser layout checks, not physical-device tests.

- Homepage: the desktop document width and scroll width were both 1,348px, with no horizontal overflow. All 16 images reported complete with a non-zero natural width in the live page. The photographic opening, scattered selected-work intro, rotating project wall, featured project, staggered project pair, flyby, contributions, about, and contact sections were inspected.
- Seagulls card: the live PNG loaded from `assets/seagulls/seagulls-mark.png?v=2` with a 768px natural width. The card shows the mark and crew caption without the previous misleading adjacent-interface note.
- Project wall: `#all-work` renders six real project links in a CSS 3D carousel. In live Chromium, the idle `--orbit-rotation` variable advanced from `206.47deg` to `208.90deg` over 900ms; the Pause control froze it, Resume restored it, and the arrow control changed the rotation by a project-sized step. A horizontal pointer drag moved the orbit from `52.67deg` to `286.80deg`. Pointer tilt changed the wall to `0.63deg` on the Y axis, and the project status updated on hover/focus. The wall and compact notebook links produced no horizontal overflow.
- Motion: the root reached `js page-ready`; the systems-card pointer handler updated `--tilt-x` and `--tilt-y`, and a hovered card produced a non-identity `matrix3d` transform. The page CSS includes explicit reduced-motion rules for the entrance, reveals, card tilt, and logo orbit.
- Image picker: click, ArrowRight, and Home changed the active image, pressed state, focus, and source credit correctly. All three full-size images loaded.
- Menu: mobile opening, Escape dismissal, and selection of Selected work were checked. Escape returned focus to the menu button with a visible solid outline. Desktop About and Get in touch links reached their sections.
- Theme: light and dark presentation reviewed; the toggle updated its pressed state.
- Flyby: keyboard End selected 300,000 km and a 77.0° turn. Play and Pause updated their pressed states. The default remains 180,000 km and 94.3°.
- Voyager: the page includes an attributed archival-photo fallback, progressive model loading, scroll sequence labels, keyboard-focusable canvas controls, reset/label toggles, pointer rotation, reduced-motion handling, visibility pausing, and graphics-context fallback. After publication, live Chromium loaded the NASA image (reported natural width 2,424px) and showed the photograph as the primary layer while WebGL was unavailable; the local telemetry background remains underneath as the network-failure fallback.
- Image-specific live pass: Chromium loaded all six wall images: AegisLand (900px), Voyager (1,440px), AbstainBench (1,348px), Seagulls (768px), the public TESS transit-recovery plot (2,420px), and ECHO / FIELD (1,600px) natural widths.
- AegisLand: direct navigation at 320px; the results table remains in a focusable horizontal-scroll region while the document stays within 305px. Voyager, AbstainBench, résumé, and ECHO / FIELD loaded directly at 390px with no document overflow or failed images.
- AegisLand explainer: the camera-angle and marker-occlusion sliders update their outputs and explanation text; the reset control restores the default view. The canvas is decorative and the text result remains available to assistive technology.
- The existing AbstainBench offline evaluation completed all 30 questions and reset correctly during the initial overhaul. Its expected perfect baseline result is a label-aware pipeline check. Optional WebLLM inference was not run.

Visual review found and corrected an intrinsically wide flyby heading, the mobile Earthrise crop, contact-label alignment, the Seagulls asset encoding, and a reveal-versus-hover transform cascade conflict. The production CSS and JavaScript use content hashes, and the Seagulls image uses a version query to avoid a stale failed-image cache.

## Solid-color contrast

Calculated from the configured foreground and background values:

| Theme | Main text | Secondary text | Accent text |
| --- | ---: | ---: | ---: |
| Light | 14.55:1 | 6.27:1 | 7.82:1 |
| Dark | 15.00:1 | 8.60:1 | 10.15:1 |

Dark text on the lilac action surface is 10.71:1. These measurements cover the named solid-color pairs, not every image-overlay pixel or a complete accessibility certification.

## Limits

- PageSpeed Insights returned HTTP 429 during the initial overhaul. No Lighthouse score or measured Core Web Vitals is claimed.
- The 3D scene uses a CDN-hosted Three.js module and Draco decoder because this repository intentionally has no package/build toolchain. CDN availability and GPU frame rate are browser-dependent; no universal FPS claim is made.
- The old responsive review fixture route currently serves the generated 404, so a fresh automated 320px or 390px screenshot was not claimed in this pass. The explicit 900px, 700px, and 359px CSS breakpoints were checked in source; OS-level reduced-motion emulation, a separate JavaScript-disabled session, and physical-device testing were not run.
- Safari, Firefox, assistive-technology, and physical-device testing were not performed.
- PR states may change after the review date; the pages link to GitHub for current status.
