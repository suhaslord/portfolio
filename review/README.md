# Suhas Beemineni

[View the portfolio](https://suhaslord.github.io/portfolio/)

I'm a student building across aerospace simulation, perception reliability, and language-model evaluation.

## Selected work

- [AegisLand](https://suhaslord.github.io/portfolio/work/aegisland.html): independent simulation research on unreliable landing-camera estimates. Includes promising early results and the limitations exposed by the failed Phase 10R holdout.
- [Voyager / Elodin](https://suhaslord.github.io/portfolio/work/voyager.html): merged contributions for trajectory-error telemetry and heliocentric relative dynamics. A separate Jupiter validation PR remains open as of September 5, 2026.
- [AbstainBench](https://suhaslord.github.io/portfolio/work/abstainbench.html): a small browser benchmark for answering and abstaining, with an offline pipeline check and optional WebLLM inference.

Project pages link to code, PRs, evaluation records, and demos. The homepage flyby is an illustrative two-body model, separate from measured Voyager results.

## Update the site

The site uses static HTML, CSS, and JavaScript. There is no application server or JavaScript build toolchain.

1. Edit `content/projects.json` for project copy, links, and status.
2. Edit `templates/home.html` for the introduction and homepage.
3. Edit `scripts/build.py` for shared navigation, metadata, the HTML résumé, and page layouts.
4. Edit `css/portfolio.css` and `js/portfolio.js` for presentation and interactions.
5. Regenerate and check the committed HTML:

```sh
python scripts/build.py
python scripts/check.py
node --check js/portfolio.js
node --check js/theme.js
```

The generator and route check use the Python standard library. For a local preview, run `python -m http.server 8000` from the repository root and open the local server in a browser.

The optional `scripts/export_assets.py` regenerates the PDF résumé and social preview. It requires Pillow, fontTools, and reportlab. Update its résumé text alongside the HTML résumé when project facts change. Font licenses are included in `assets/fonts/`.

## Publishing

GitHub Pages publishes the committed files from `main` using this repository's existing Pages deployment. Commit generated HTML together with its source changes. Keep the `/portfolio/` base path, case-study `.html` URLs, and existing domain settings.

[Design notes and sources](DESIGN.md) explain the visual and editorial choices. [Verification notes](VERIFICATION.md) record the checks and their limits.

## Contact

[GitHub](https://github.com/suhaslord) · [Email](mailto:suhas.aug20@gmail.com)
