# Suhas Beemineni

[Portfolio](https://suhaslord.github.io/portfolio/)

Selected research and engineering work at UC Santa Cruz, San Diego State, Cal Poly Pomona, Seagulls, and Elodin.

The site is static HTML, CSS and JavaScript, with persistent Barba page transitions and a single Lenis/GSAP clock. Home, Work, About, Contact and the résumé have separate routes. Ten case pages include the main research and merged open-source contributions. The old archive route forwards to Work. Edit `content/projects.json`, `content/resume.json`, `templates/home.html`, `scripts/site_parts.py`, `css/site.css`, `css/flow.css`, `js/site.js`, `js/flow.js` and `js/pages.js`, then run:

```sh
python scripts/build.py
python scripts/check.py
node --check js/site.js
node --check js/pages.js
node --check js/flow.js
```

Commit source and generated HTML together. GitHub Pages publishes `main` at the existing `/portfolio/` path. Project images are actual saved outputs; notes on provenance and the reference design are in `DESIGN.md`.

The contact form validates fields and opens an email draft. It does not use a remote form service or claim to send mail from GitHub Pages. Mobile uses native touch scrolling, stacked project images and no pointer-follow effects. `REFERENCE_AUDIT.md` records the inspected reference pages and controls.

Home keeps the reference-inspired large project rows with cursor-following result previews, opposing horizontal evidence galleries, animated recognition figures and the curved contact ending. Mobile puts real images directly above each project. A single animation clock drives smooth scrolling and pointer tracking; scroll and magnetic button motion target separate elements. `js/flow.js` owns interior-page content reveals and their route cleanup.

Motion polish preserves this composition. Wheel input accelerates an unfinished entrance without jumping it to its final frame. The menu retargets its current pose when reversed; magnetic controls and liquid fills respond sooner. Cursor hit-testing is batched per animation frame, with touch and keyboard input clearing decorative previews.

`js/motion.js` adds the visible presentation layer: scroll-controlled project-title masks and rules, a spring-following result preview with a small velocity tilt, gallery image/caption sequences, staggered recognition and layered footer lines. Liquid controls use mirrored, accessibility-hidden labels for an interruptible vertical roll. The hero keeps its existing composition with softer lighting and a small velocity response in the name marquee. `scripts/check_motion.js` checks spring settling and retargeting at several simulated frame rates. Run `npm run check` for the complete check set.

Magnetic controls also use the shared spring model. A single tick advances only the hovered control and controls returning to rest. Text has its own lighter follow, quick re-entry keeps velocity, and keyboard or touch input clears the offsets immediately.
