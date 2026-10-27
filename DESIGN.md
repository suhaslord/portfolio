# Portfolio design

Reference: https://dennissnellenberg.com/, inspected October 26, 2026.

The reference supplied the composition: a gray full-height hero, oversized scrolling name, simple corner navigation, a left-edge location badge, large separated work rows with hover previews, circular links and a charcoal contact section. Suhas's words, work and images replace the reference content.

Live DOM evidence: hero background `rgb(153,157,158)`, body ink `rgb(28,29,32)`, regular-weight sans typography, large name at about 15vw. The reference's portrait placement, white lettering, minimal navigation and proportions were inspected.

Implementation: static HTML/CSS/JavaScript; system grotesque typography, neutral backgrounds, blue circular interaction accent. All project images are saved results, the actual MARVIN lab photo, or the Seagulls team mark. No reference photographs, proprietary fonts, code or copy are reused.

The reference's full-height portrait is not reproduced: no real portrait of Suhas was available. A simple typographic monogram holds that central space. The site uses a single name marquee, hover previews and magnetic circular links. Reduced motion removes continuous motion and pointer effects. Mobile shows result images directly in the stacked work list.

Homepage scope: UCSC AIEA, SDSU lunar navigation, CPP AVL, Seagulls and Voyager. Smaller experiments are removed from the showcase; the résumé includes the broader verified history. Old experiment URLs return to selected work.

Runtime layers: header and preview 3, menu backdrop 4, menu 5, navigation button 6, page curtain 8. The preview cannot intercept pointer events. No WebGL requirement. The entry curtain is applied only after the animation code is ready; the page stays accessible without JavaScript.

Design read: a portfolio for research mentors and engineering teams, using a kinetic sans-serif composition. The gray hero, white header text, typography, dark footer and location badge follow the explicitly requested reference.

## Motion refinement

A second live inspection measured the reference's name at 15vw, work names at 5.25vw, 8vw work-list margins, 16vw introduction/footer margins, and a 37.5vw navigation panel. The refined site uses those proportions. It uses a system grotesque fallback instead of redistributing the reference's proprietary Neue Montreal font.

GSAP and ScrollTrigger sequence the menu, word reveals, page curtain and footer curve. Lenis supplies wheel interpolation on the same clock. The View badge follows in 140ms, preview media in 280ms, and magnetic buttons in 240ms. New previews show the correct image immediately; adjacent project changes glide through the image rail. A small velocity-driven tilt gives the frame weight without delaying the pointer. Seagulls' logo occupies half the frame. The Cal Poly photo is the actual MARVIN lab image, credited on its project page.

A direct homepage opening cycles through eleven greetings, including Telugu, in about 1.6 seconds, followed by a curved reveal. Returning from another page or opening a section link skips the greeting sequence. Clicking, scrolling or pressing a key finishes the intro immediately. Page content enters while the curtain lifts. Outgoing page transitions take 300ms; the navigation opens in 500ms and closes in 340ms. Keyboard actions skip decorative delays.

The globe uses CSS 3D meridians with a twelve-second rotation that pauses outside the viewport. The name marquee eases into direction changes, buttons have a restrained elastic release, and scroll-linked sections use short scrub values so they stay close to the scroll position. Native touch scrolling is retained.

Reduced motion uses native scrolling, static content and an instant menu. No content depends on a successful intro animation. The résumé is populated from content/resume.json and includes research, work, open source, leadership, volunteering, education, skills, recognition and athletics. It is intentionally more complete than the homepage.
