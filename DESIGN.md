# Portfolio design

A reference-led redesign for Suhas Beemineni, following the user's request to draw from [21 Oaks](https://21oaks.org/). The implementation keeps the repository's static HTML/CSS/JavaScript stack, established GitHub Pages workflow, and existing URLs.

## Reference and direction

The reference was inspected in a browser: its photographic opening, compact floating navigation, image selector, large serif typography, generous white space, lilac accents, scattered image index, and staggered editorial sections informed the design. Its photographs, writing, proprietary typeface, and source code were not reused.

- Locally hosted Lora supplies the expressive serif headings. Space Grotesk handles practical reading; IBM Plex Mono is reserved for measurements and identifiers. Font licenses are included.
- White and graphite define the main surfaces. Lilac (#e8ceff) connects navigation, actions, underlines, and the contact section. Dark theme preserves the same hierarchy.
- A full-height photograph leads into a loose image index, one substantial AegisLand feature, then staggered Voyager and AbstainBench features. The broader systems section gives Seagulls / OpenStage and the astronomy work their own visual weight without flattening everything into equal cards.
- The image selector offers historical NASA photography and the author's actual Elodin demonstration. Each view has a source link. It changes on request, without automatic cycling.
- The flyby has its own section. It is an explicitly illustrative two-body teaching model, separate from measured Voyager results. Playback starts on request and pauses offscreen or in background tabs.
- Motion uses short menu transitions, image crossfades, small hover responses, modest section reveals, and one scroll-directed Voyager sequence. The 3D section is intentionally short enough to preserve native scrolling. Reduced-motion preferences disable decorative movement and keep controls usable.
- The compact menu supports keyboard use, outside-click dismissal, and Escape. Essential navigation remains available without JavaScript.

## Content and hierarchy

Visitors see Suhas's name, student background, cross-disciplinary focus, a first case-study link, and evidence of engineering work in the opening. Three substantial projects receive the main case-study space. Seagulls / OpenStage and independent astronomy work are surfaced as systems-level work; contributions stay compact near the end. A wider notebook lists the other public and explicitly shareable threads without making unsupported status claims.

Case studies explain individual contributions, technical decisions, results, status, and limitations. AegisLand's failed Phase 10R holdout remains explicit and now includes a separate educational camera/occlusion explainer; the AbstainBench offline baseline is not presented as model performance. The Voyager section uses the NASA 3D Resources model and Jupiter texture with local provenance notes, while its path is labeled illustrative. The archived ECHO / FIELD route and old homepage anchors remain supported.

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
- Voyager 3D: `assets/3d/voyager-a.glb` is the NASA 3D Resources Voyager Probe (A) model (about 286 KB); `jupiter-map.jpg` is the matching NASA texture. The module loads the model and Draco decoder progressively, caps device pixel ratio at 1.5, pauses when hidden, and leaves a CSS spacecraft silhouette as the first-paint fallback.
- NASA's official insignia is not reproduced. NASA's published brand guidelines reserve it for NASA-sponsored pages or explicit permission; the page uses plain linked attribution instead.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| Static photograph-only opening | Progressive Voyager scene with a stable CSS silhouette | Gives the engineering story a signature moment without withholding the name, focus, or links while assets load. |
| One generic image picker for the technical work | Scroll-directed close → instrument → planet sequence with explicit status labels | Motion explains the relationship between the spacecraft, the scene, and the trajectory. |
| Seagulls as one paragraph in the About section | Dedicated systems card plus a wider work archive | Represents the team product work without overstating individual ownership or crowding the case studies. |
| No visual explanation inside AegisLand | Adjustable camera angle and marker occlusion explainer | Makes the perception problem legible while clearly separating teaching geometry from measured results. |
| Official-looking NASA badge | Plain NASA-linked attribution and provenance file | Respects NASA identifier restrictions and avoids implying sponsorship or endorsement. |

## Editing

Edit `content/projects.json` for case studies, `templates/home.html` for the homepage, and `css/portfolio.css` for presentation. Run `python scripts/build.py` and `python scripts/check.py`. Generated pages are committed because GitHub Pages publishes the repository directly. Shared CSS and JavaScript URLs include content hashes to refresh cached assets after changes.

`scripts/export_assets.py` regenerates the résumé PDF and social preview using Pillow, fontTools, and reportlab. To update only the social preview, run `python -c 'from scripts.export_assets import social; social()'`.
