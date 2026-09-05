# Portfolio design

This is a full visual and editorial overhaul for recruiters, engineering mentors, and potential collaborators.

Design read: a student engineering portfolio with precise, restrained aerospace character.
DESIGN_VARIANCE: 6. MOTION_INTENSITY: 3. VISUAL_DENSITY: 4.
The site keeps its existing static HTML/CSS/JS architecture and GitHub Pages URLs.

## Audit

The previous homepage hid the portfolio behind an entry dialog. It used Fraunces and Source Serif on cream, with copper and forest accents, a location clock, repeated numbered labels, and long paragraphs about claim boundaries. The same AegisLand result appeared repeatedly. The main page did not link to the merged Voyager contributions, and several old case-study anchors no longer matched the homepage.

The overhaul makes the name, focus, work, and contact paths immediately available. Old anchors research, system, build, ship, work, and contact continue to resolve.

## Decisions

- Space Grotesk, locally hosted, gives the name a distinct shape without a display-serif cliché. IBM Plex Mono is limited to actual measurements and PR identifiers.
- Cool off-white and graphite define the two themes. One orange accent marks interactive geometry and important links. Corners use a 2px radius.
- One large AegisLand feature is followed by two project-specific media blocks. The contribution list and about section use different structures.
- The flyby is an explicitly illustrative, interactive two-body model. No scene, number, or screenshot is presented as measured Voyager telemetry unless it is from the actual public demo.
- Motion is initiated by the visitor. Playback stops offscreen and in background tabs; reduced-motion preference switches playback to discrete steps.
- Captions and case studies distinguish model scope, independent work, merged contributions, and open review.

## Design research

- [Paul Bakaus: Impeccable by Design](https://www.paulbakaus.com/impeccable-by-design/) explains that replacing one popular pattern with another does not establish a point of view. Applied through content-specific hierarchy, real project evidence, and browser review.
- [Anthropic: Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills) discusses generic output defaults and the value of explicit visual direction. Applied through a fixed type, palette, layout, and motion system.
- [Paul Bakaus: AI slop design tells](https://www.linkedin.com/posts/paulbakaus_ai-slop-design-tells-design-anti-patterns-activity-7416272383017164800-10DR) identifies repetitive cards, redundant writing, and decorative effects. Applied by removing the entry gate, filler labels, fake metrics, and decorative animation.

These are design critiques, not scientific tests for whether a website was AI-generated.

## Sources and assets

Case-study facts and links are in content/projects.json. The public project README and GitHub PR states were checked on September 5, 2026.
The Seagulls role summary was already present in the user's public résumé. Private repositories and private communications were not published.

- AegisLand geometry: existing repository asset, credited in assets/aegisland/SOURCE.txt.
- Voyager screenshot: frame from the author's public PR #769 demo at https://github.com/user-attachments/assets/f2d51b38-0943-48f1-bba0-229b4466c1b0.
- AbstainBench screenshot: actual hosted interface at https://suhaslord.github.io/portfolio/demos/abstainbench/.
- Fonts: Google Fonts distributions of Space Grotesk and IBM Plex Mono; OFL licenses included in assets/fonts.
- Social preview and flyby fallback: mathematically drawn, with no generated research data.

## Editing

Edit content/projects.json for case-study text and evidence, templates/home.html for the homepage, and css/portfolio.css for the design.
Run python scripts/build.py and python scripts/check.py. The generated pages are committed because GitHub Pages publishes the repository directly.
The optional scripts/export_assets.py regenerates the résumé PDF and social preview using Pillow, fontTools, and reportlab.
