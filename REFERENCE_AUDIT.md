# Reference audit — October 26, 2026

Inspected the live Dennis Snellenberg site before this implementation pass: Home, Work, About, Contact, Archive, TWICE and The Damai. Clicked More work, all three Work filters, the grid switch, project entry, Next case, All work, and a contact-field focus state. Read the forms without submitting a message. External social sites and third-party production websites are outside this portfolio audit.

| Before in Suhas's site | Target after inspection | Why |
| --- | --- | --- |
| Work/About navigation jumped to home sections | Separate Work, About, Contact and résumé routes | The reference has distinct page compositions |
| More work led to the résumé | Work table, category filters, list/grid switch, archive | Recreate the actual browsing flow |
| Nearly full-size preview appeared in 240ms | Soft scale/fade entrance, image decoding, pointer intent | Avoid a surprise image when scrolling underneath the cursor |
| Blank page curtain with a possible first-paint flash | Destination label and a pre-paint cover across navigation | Preserve continuity between documents |
| Footer content moved upward from below | White rounded edge reveals content with opposing parallax | Match the reference's overlapping page-to-footer motion |
| Footer email changed background slightly | Rising blue fill, magnetic hit area, separate text movement | Match contact-button behavior |
| Copyright and three plain links | Version, California local time, and links grouped across the bottom | Match the footer's information hierarchy |
| Narrow project image and small next-project link | Wide result media, three-column metadata, large Next case ending | Match the case-study flow with actual project evidence |

Measured reference proportions: 115svh home hero; 15vw name; 6.125vw primary page titles; 7vw case title; 68% title/footer container; 84% project media/work-list container; 5.25vw home rows versus 2.45vw Work table titles. Work defaults to a four-column list. Its alternate view uses two image columns. Category pills and view switches are about 5.1vw tall. Archive uses the same compact table on a pale gray surface.

The footer has a 0.85em portrait beside the first title line, a small down-left arrow, a blue 12vw circle crossing a separator at roughly 8.5% from the container's right edge, outlined contact pills, and a bottom Version/Local time/Socials row. It starts with 14.4vw padding. The title-to-separator gap is about 7.2vw; the contact pills start about 6.8vw below that line. The footer content scrolls at a different rate from the white curved edge.

About uses a two-line title, a blue globe on a separator, an asymmetric text/photo section, three numbered columns on gray, a second split section, and the shared contact ending. Contact uses a charcoal surface, a numbered five-field form, a right-side contact column, a large circular submit control, and the same bottom metadata.

Adaptation constraints: use Suhas's verified content and real output images. No invented portraits, phone number, client list, research accomplishments, or social accounts. Keep AbstainBench and ECHO out. DM Sans is the bundled open-source substitute for the reference's licensed typeface. Native touch scrolling, readable mobile type, direct media cards, accessible filters and reduced-motion behavior are required.

## October 27: continuity and achievement presentation

| Before | After | Why |
| --- | --- | --- |
| Full document reload behind each curtain | Persistent Barba container handoff, route prefetch and a persistent scroll clock | Remove the reload gap and keep the transition continuous |
| CSS transform transitions and GSAP on the same buttons | GSAP owns motion; CSS owns color | Remove the second layer of smoothing |
| Hover images gated by scroll velocity and hidden on scroll | Time-based cursor following and hit-testing during scrolling | Keep the preview connected to the row under the pointer |
| Additional research and merged contributions relegated to Archive | Ten complete case pages and a six-tile homepage evidence gallery | Give the additional work its own presentation and actual output |
| Achievements only discoverable in the résumé | Animated award/teaching figures on Home; full community and experience sections on About | Make substantial achievements visible during normal browsing |
| Scroll-linked effects had a second scrub delay | Direct scrub from the common scroll clock | Stop stacking smoothing delays |

Motion behavior was compared with the reference's public runtime: a 0.5 second incoming curtain, 0.8 second outgoing curtain, staggered exponential content entrance, delayed image/button cursor layers, 0.6 second image-rail changes, magnetic controls, and through-travelling button fills. This implementation is original; the reference's proprietary runtime, photos, and typefaces are not redistributed.

New evidence: the saved September 29 Cal Poly update; the saved Tulsa edge-anchor geometry package; merged NASA python_cmr #119, OpenMDAO Aviary #1262, and OpenC3 COSMOS #3720. Replotted charts are labeled. Tulsa is explicitly a synthetic geometry check with no experimental data. No meeting slides, private correspondence, or certificates are published.
