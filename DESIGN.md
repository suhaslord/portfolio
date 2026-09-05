# Portfolio design

A reference-led redesign for Suhas Beemineni, following the user's request to draw from [21 Oaks](https://21oaks.org/). The implementation keeps the repository's static HTML/CSS/JavaScript stack, established GitHub Pages workflow, and existing URLs.

## Reference and direction

The reference was inspected in a browser: its photographic opening, compact floating navigation, image selector, large serif typography, generous white space, lilac accents, scattered image index, and staggered editorial sections informed the design. Its photographs, writing, proprietary typeface, and source code were not reused.

- Locally hosted Lora supplies the expressive serif headings. Space Grotesk handles practical reading; IBM Plex Mono is reserved for measurements and identifiers. Font licenses are included.
- White and graphite define the main surfaces. Lilac (#e8ceff) connects navigation, actions, underlines, and the contact section. Dark theme preserves the same hierarchy.
- A full-height photograph leads into a loose image index, one substantial AegisLand feature, then staggered Voyager and AbstainBench features. Case studies use a quiet reading column.
- The image selector offers historical NASA photography and the author's actual Elodin demonstration. Each view has a source link. It changes on request, without automatic cycling.
- The flyby has its own section. It is an explicitly illustrative two-body teaching model, separate from measured Voyager results. Playback starts on request and pauses offscreen or in background tabs.
- Motion is limited to short menu transitions, image crossfades, small hover responses, and modest section reveals. Reduced-motion preferences disable transitions and use discrete trajectory steps.
- The compact menu supports keyboard use, outside-click dismissal, and Escape. Essential navigation remains available without JavaScript.

## Content and hierarchy

Visitors see Suhas's name, student background, aerospace/AI focus, a first case-study link, and two merged Elodin contributions in the opening. Three substantial projects receive the main space. Seagulls / OpenStage remains a short background reference because the available shareable evidence is narrower.

Case studies explain individual contributions, technical decisions, results, status, and limitations. AegisLand's failed Phase 10R holdout remains explicit; the AbstainBench offline baseline is not presented as model performance. The archived ECHO / FIELD route and old homepage anchors remain supported.

## Design research

- [Paul Bakaus: Impeccable by Design](https://www.paulbakaus.com/impeccable-by-design/) discusses why replacing one popular pattern with another does not establish a point of view.
- [Anthropic: Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills) discusses generic output defaults and the value of specific visual direction.
- [Paul Bakaus: AI slop design tells](https://www.linkedin.com/posts/paulbakaus_ai-slop-design-tells-design-anti-patterns-activity-7416272383017164800-10DR) critiques repetitive cards, redundant writing, and decorative effects.

These are design critiques, not scientific tests for AI authorship. The user's chosen reference determines the typography and palette. Quality comes from intentional composition, project-specific material, accurate writing, and review of the rendered experience.

## Evidence and assets

Case-study facts and links are maintained in `content/projects.json`. Public repository and PR records were checked September 5, 2026. The Seagulls summary was already present in the user's public résumé. Private repositories and communications were not published.

- AegisLand: repository image; credit in `assets/aegisland/SOURCE.txt`.
- Voyager: frame from the author's [public PR #769 demo](https://github.com/user-attachments/assets/f2d51b38-0943-48f1-bba0-229b4466c1b0).
- AbstainBench: screenshot of the actual [hosted interface](https://suhaslord.github.io/portfolio/demos/abstainbench/).
- NASA photographs: sources and attribution in `assets/space/SOURCE.md`.
- Fonts: Google Fonts distributions of Lora, Space Grotesk, and IBM Plex Mono; OFL licenses in `assets/fonts`.
- Social preview: exact typesetting over credited Earthrise photography. Flyby geometry is calculated; no research data is generated for decoration.

## Editing

Edit `content/projects.json` for case studies, `templates/home.html` for the homepage, and `css/portfolio.css` for presentation. Run `python scripts/build.py` and `python scripts/check.py`. Generated pages are committed because GitHub Pages publishes the repository directly. Shared CSS and JavaScript URLs include content hashes to refresh cached assets after changes.

`scripts/export_assets.py` regenerates the résumé PDF and social preview using Pillow, fontTools, and reportlab. To update only the social preview, run `python -c 'from scripts.export_assets import social; social()'`.
