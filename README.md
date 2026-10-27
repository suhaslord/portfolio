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

The homepage shares one persistent result panel across the five lead projects on wide screens. The reading position selects the result; pointer and keyboard focus can inspect another project without moving the document. Narrow screens put each image directly beside its text in normal document flow. The remaining five projects are shown once each. `js/flow.js` owns the coordinated content reveals and their route cleanup.
