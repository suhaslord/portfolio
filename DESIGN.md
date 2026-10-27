# Portfolio design

Reference: https://dennissnellenberg.com/, inspected October 26, 2026.

The reference supplied the composition: a gray full-height hero, oversized scrolling name, simple corner navigation, a left-edge location badge, large separated work rows with hover previews, circular links and a charcoal contact section. Suhas's words, work and images replace the reference content.

Live DOM evidence: hero background `rgb(153,157,158)`, body ink `rgb(28,29,32)`, regular-weight sans typography, large name at about 15vw. A captured hero image found through web image search was visually inspected to confirm the portrait placement, white lettering, minimal navigation and proportions. The live site's introduction remained overlaid in the inspection browser, so its complete motion was not verified.

Implementation: static HTML/CSS/JavaScript; existing self-hosted Space Grotesk fonts, neutral backgrounds, blue circular interaction accent. All project images are saved results or the actual Seagulls team mark. No reference photographs, proprietary fonts, code or copy are reused.

The reference's full-height portrait is not reproduced: no real portrait of Suhas was available. A simple typographic monogram holds that central space. The site uses a single name marquee, hover previews and magnetic circular links. Reduced motion removes continuous motion and pointer effects. Mobile uses stacked work rows and a horizontally scrollable results gallery.

Homepage scope: UCSC AIEA, SDSU lunar navigation, CPP AVL, Seagulls and Voyager. Smaller experiments are removed from navigation, homepage, résumé and sitemap. Old experiment URLs return to selected work.

Runtime layers: header 3, menu backdrop 4, menu 5, navigation button 6. The preview sits at layer 2 and cannot intercept pointer events. No page load gate or WebGL requirement.

Design read: a full portfolio overhaul for research mentors and engineering teams, using a kinetic sans-serif composition. Dials: variance 8, motion 7, density 2. Native CSS/JS retains the static stack. Hero gray is slightly darker than the reference to keep the large white type readable; header text is dark. Typography, a dark footer and location badge follow the explicitly requested reference rather than the generic skill defaults.
