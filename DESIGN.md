# Portfolio design

Reference: https://dennissnellenberg.com/, inspected October 26, 2026.

The reference supplied the composition: a gray full-height hero, oversized scrolling name, simple corner navigation, a left-edge location badge, large separated work rows with hover previews, circular links and a charcoal contact section. Suhas's words, work and images replace the reference content.

Live DOM evidence: hero background `rgb(153,157,158)`, body ink `rgb(28,29,32)`, regular-weight sans typography, large name at about 15vw. The reference's portrait placement, white lettering, minimal navigation and proportions were inspected.

Implementation: static HTML/CSS/JavaScript; self-hosted DM Sans variable typography, neutral backgrounds, blue circular interaction accent. DM Sans comes from the official Google Fonts repository under the bundled SIL Open Font License. All project images are saved results, the actual MARVIN lab photo, or the Seagulls team mark. No reference photographs, proprietary fonts, code or copy are reused.

The reference's full-height portrait is not reproduced: no real portrait of Suhas was available. A simple typographic monogram holds that central space. The site uses a single name marquee, hover previews and magnetic circular links. Reduced motion removes continuous motion and pointer effects. Mobile shows result images directly in the stacked work list.

Homepage scope: UCSC AIEA, SDSU lunar navigation, CPP AVL, Seagulls and Voyager. Smaller experiments are removed from the showcase; the résumé includes the broader verified history. Old experiment URLs return to selected work.

Runtime layers: header and preview 3, menu backdrop 4, menu 5, navigation button 6, page curtain 8. The preview cannot intercept pointer events. No WebGL requirement. The entry curtain is applied only after the animation code is ready; the page stays accessible without JavaScript.

Design read: a portfolio for research mentors and engineering teams, using a kinetic sans-serif composition. The gray hero, white header text, typography, dark footer and location badge follow the explicitly requested reference.

## Motion refinement

A second live inspection measured the reference's name at 15vw, work names at 5.25vw, 8vw work-list margins, 16vw introduction/footer margins, and a 37.5vw navigation panel. The refined site uses those proportions. The licensed Neue Montreal font is not redistributed; DM Sans supplies a consistent open-source alternative across platforms.

GSAP and ScrollTrigger sequence the menu, word reveals, page curtain and footer curve. Lenis supplies wheel interpolation on the same clock. The View badge follows in 140ms, preview media in 280ms, and magnetic buttons in 240ms. New previews show the correct image immediately; adjacent project changes glide through the image rail. A small velocity-driven tilt gives the frame weight without delaying the pointer. Seagulls' logo occupies half the frame. The Cal Poly photo is the actual MARVIN lab image, credited on its project page.

A direct homepage opening cycles through eleven greetings, including Telugu, in about 1.6 seconds, followed by a curved reveal. Returning from another page or opening a section link skips the greeting sequence. Clicking, scrolling or pressing a key finishes the intro immediately. Page content enters while the curtain lifts. Outgoing page transitions take 300ms; the navigation opens in 500ms and closes in 340ms. Keyboard actions skip decorative delays.

The globe is an SVG wireframe with three rolling meridians, clipped latitude lines, a true equator, and a gentle 5.4-second tilt. Meridians roll in staggered 2.7-second cycles. Non-scaling strokes keep the fine line weight steady. The badge has an actual transparent circular cutout, with its 2.5:1 proportions and globe placement calibrated to the reference. Its animation pauses outside the viewport. Hero role text uses two lines, with a drawn arrow and an em dash in the name marquee.

The name marquee eases into direction changes, buttons have a restrained elastic release, and scroll-linked sections use short scrub values so they stay close to the scroll position. Native touch scrolling is retained.

Reduced motion uses native scrolling, static content and an instant menu. No content depends on a successful intro animation. The résumé is populated from content/resume.json and includes research, work, open source, leadership, volunteering, education, skills, recognition and athletics. It is intentionally more complete than the homepage.

## Complete page flow

The reference audit is recorded in `REFERENCE_AUDIT.md`. Home now leads to a dedicated Work page with category filters and a compact four-column list, an alternate two-column image grid, and a twelve-entry archive. About and Contact are distinct compositions. The full résumé remains directly accessible. Case pages use wide real-result media, three metadata columns, and an image-led Next case ending.

Page covers include the destination title and curved leading/trailing edges. A small pre-paint bootstrap preserves the cover during document navigation, avoiding a flash of the incoming content. Pointer or keyboard input can complete the entry immediately. Project previews wait for pointer intent and decoded media, then use a 460ms entrance; tracking stays responsive and adjacent images glide through the rail.

The shared ending has a white rounded cover, opposing footer parallax, a title avatar made from initials until a portrait is supplied, a magnetic contact circle, rising button fills, and Version/California local time/Links groups. No phone number or social account is invented. The Contact page's form creates an email draft rather than pretending to have a mail backend.

Mobile uses direct image cards, native touch scrolling, 48px filter targets, stacked case metadata, a single-column About/Contact layout, 18px form inputs and a scrollable full-height menu. Pointer effects and desktop preview downloads are omitted. The résumé, actual result images and their qualifications are retained.
