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

## Content flow pass (reverted on Home)

| Before | After | Why |
| --- | --- | --- |
| Lead project images required hover | One sticky result panel follows the project being read | Keep the work visible through the whole sequence |
| Button separated the lead work from additional evidence | All work follows one sequence, then the Work link | Remove the premature stopping point |
| Voyager repeated in two places | Five lead projects, then five additional projects | Give every project a clear place |
| Intro used a general statement about building things | Short, specific introduction to AI, robots, and navigation | Let the work explain the motivation |
| Intro button scroll and pointer motion targeted the same transform | Scroll moves its wrapper; pointer motion moves the button | Avoid competing transform updates |
| Sections revealed at different speeds | Shared line reveals and group entrances | Connect the reading rhythm across Home, About, and case pages |
| Case images had no intrinsic dimensions | Images reserve their real aspect ratio | Avoid layout shifts while the page loads |
| Community and experience were independent full-width tables | Persistent section titles beside the entries | Keep context while moving through the details |

The flow uses ordinary document scrolling and native CSS sticky positioning. No scroll locking, snapping between projects, synthetic counter totals, or fabricated project pictures are introduced. Touch layouts remain ordinary vertical content. Keyboard focus changes the result immediately; reduced motion changes the result without a transition.

## Homepage restoration

The user rejected the new sticky layout. Home is restored from the version preceding the content-flow pass: original introduction, full-width lead project rows and hover previews, More work button, two opposing three-image evidence galleries, recognition figures, and curved footer. Interior pages retain their content-flow improvements and complete results.

| Before | After | Why |
| --- | --- | --- |
| Sticky project panel and text-heavy split rows | Previous large project rows and cursor-following preview rail | Restore the explicitly requested reference-inspired composition |
| Reworked gallery proportions and order | Original two three-image rows with opposing 4vw travel | Restore the previous scrolling character |
| Pointer hit-testing on pointer, window scroll and Lenis events | At most one hit-test on the shared animation tick | Avoid redundant layout reads while scrolling |
| Fixed hover images trigger a full scroll refresh when loaded | Only in-flow media requests a frame-batched refresh | Prevent unnecessary recalculation during movement |
| Scroll and magnetic tweens could move the same button | Original placement, with scroll targeting a wrapper | Keep motion continuous without changing its appearance |
| Scroll smoothing lingers at lerp .1 | Lerp .12, retaining direct scrubs | Respond slightly sooner without adding a second easing layer |

## Motion polish of the approved homepage

| Before | After | Why |
| --- | --- | --- |
| Wheel input finishes every entrance with `progress(1)` | Input accelerates the active timeline continuously to 1.6× | Avoid jumping a moving curtain or title to its final frame |
| Scrolling runs underneath the initial closed curtain | Lenis resumes as the content starts entering | Keep the page aligned with the visible handoff |
| Reopening a closing menu resets the curve and links with `fromTo` | Curve, panel and links retarget their current poses | Preserve continuity during a quick reversal |
| Magnetic controls follow for 1.1 seconds and return for 1.2 | 0.55 second follow and 0.75 second subtle return | Remove the long tail while preserving the reference's fluid feel |
| Liquid fills wait on a 0.6 second ease-in-out entrance | 0.4 second power3-out entrance and 0.45 second through-exit | Respond immediately and retain the travelling fill |
| Work filters reintroduce rows over 0.85 seconds and 45px | 0.48 seconds and 22px, keeping the short stagger | Reduce the wait after a deliberate filter change |
| Generic cursor badges hit-test on each pointer and scroll event | One sample on the shared animation tick, cleaned up on navigation | Bound hover work to the rendering rate |
| An old image decode can update a disposed page or hide a newer preview | Check the mount's abort signal and active row before resolving | Prevent asynchronous flicker during quick navigation |
| Decorative previews can remain after switching to the keyboard | Keyboard clears them immediately; touch never starts them | Keep focus and content unobstructed |
| Every word and magnetic link permanently requests a compositor layer | GSAP promotes moving controls only as needed | Reduce idle rendering layers without changing layout |
| Idle Lenis leaves the root's CSS smooth scrolling active | Root scroll behavior is automatic; scripted anchors explicitly request smooth motion | Prevent native focus scrolling from competing with the scroll engine and moving click targets |

Feel and timing: the reference's long curved page transitions, cursor bloom and direct opposing gallery scrubs are deliberately retained, as requested. These portfolio presentation effects have a different budget from repeated UI controls. No new sections, text, image sizes or project ordering are introduced. Keyboard routes and reduced-motion paths remain immediate.

Review decision: approve for the requested reference motion, subject to the live checks recorded with this release. Desktop browser checks cover Home → Work → Home, rapid menu reversal, hover selection while scrolling, filter changes and cursor removal on keyboard input. Native phone scrolling remains in place; this environment does not provide phone viewport emulation.

## Visible motion and finish

| Before | After | Why |
| --- | --- | --- |
| Project titles remain static while the page moves | Masked titles, metadata and hairlines reveal directly from scroll position | Give the existing full-width rows a visible, continuous entrance |
| Result previews use first-order pointer interpolation and grow from zero | Damped springs preserve velocity, a small tilt follows horizontal movement, and the frame opens from 90% scale | Give the result frame a physical follow and a softer landing |
| A preview can clip against the viewport edge | The image frame stays within an 18px safe edge while its View button follows the pointer | Keep actual results fully in view |
| Liquid fills move behind a static label | The original and an accessibility-hidden copy roll through a clipped label | Make the control's response visible while preserving its text and shape |
| Gallery tiles share only opposing horizontal travel | Image, image scale and caption entrances overlap in short sequences | Keep the original gallery and add depth as it comes into view |
| Recognition figures enter at once | Rules, values and labels enter in a short sequence | Give the achievements the same authored rhythm as the work |
| The entire contact ending moves as one plane | Title lines move within the existing curved footer reveal | Connect the ending to the scroll motion above it |
| Flat gray hero and rigid marquee | Soft neutral lighting and a capped 2.5-degree velocity skew | Add depth and response without changing the hero's content or layout |
| Incoming curtain accelerates into a hard stop | A symmetric cover curve flows into a longer, eased outgoing curtain and overlapping content | Make page handoffs feel continuous |

All result images, written content, project order, routes, large rows and gallery structure are retained. Touch scroll stays native; pointer tilt, hover zoom and rolling hover labels are gated to a fine pointer. Reduced motion keeps the untransformed content and original labels. Keyboard focus reveals titles immediately and clears the decorative preview.

Physics verification passes at simulated 30, 60 and 120Hz, including retargeting, bounded overshoot and long-frame stability. These checks measure the spring calculation, not browser frame rate. The shared page teardown removes observers, scroll listeners and tickers before mounting the next route.

## Consistent control movement

| Before | After | Why |
| --- | --- | --- |
| Previews use springs while buttons repeatedly retarget duration-based tweens | Controls and their labels also preserve spring velocity | Make changes in pointer direction feel consistent across the page |
| Magnetic geometry is read on every pointer event | The active control is measured once on the shared tick | Bound layout reads to rendered frames |
| Each returning button starts a new elastic tween | The existing velocity settles continuously toward the resting position | Remove the restart when the pointer quickly leaves and re-enters |
| Keyboard focus can inherit a magnetic offset | Keyboard, touch and window blur immediately reset active controls | Keep focus and tap targets stable |
| Menu entry and magnetic follow can write to the same link transform | Menu entry moves the anchor; pointer motion moves its inner text | Keep the opening stagger and pointer movement independent |

The control springs and label springs pass the same simulated 30/60/120Hz checks as the image preview, including returning to zero after movement. Route teardown removes the tick and clears the transforms.

Portrait request fulfilled with the image supplied directly by Suhas. The original PNG is used on About and in the existing footer/contact avatars. Its surrounding screenshot border is trimmed through CSS; the file bytes and appearance of the photograph are preserved.

## Freer scrolling and supplied portrait

| Before | After | Why |
| --- | --- | --- |
| Project titles are clipped and scrubbed from 100% vertical offset | Complete, unmasked titles glide 26px once | Keep the work readable and avoid tying each row to a mechanical reveal gate |
| Scrolling upward rewinds title visibility and partial divider widths | Completed entrances stay settled; full dividers are always present | Make returning through the work feel continuous |
| Gallery images enter from 55px with strong fading and zoom | 28px travel, readable opacity, lighter zoom and shorter offsets | Keep the opposing drift without each tile feeling separately staged |
| Introduction and recognition headings emerge through masks | Open text with small one-time movement | Preserve the editorial hierarchy with less clipping |
| About shows a rover photo; contact avatars show initials | The supplied portrait appears in those personal positions | Give the site a real personal image while keeping result images with their projects |
| The source portrait includes a narrow dark screenshot border | CSS presents its 400px square photo area inside reserved frames | Use the supplied photo naturally without rewriting the source image |
| Every in-flow image load can request a scroll refresh | Fixed portrait frames do not request one | Keep lazy avatar decoding from recalculating scroll positions mid-gesture |

The page composition, project order, hero, hover physics, menu behavior and continuous gallery/footer scrubs remain in place. Verification covers forward and reverse browsing, portrait loading and cropping, page handoffs, and keyboard use. Reduced motion retains complete text and the same portrait frames.

Mid-page reload verification exposed a ScrollTrigger initialization error when completed `once` triggers removed themselves during a later trigger's refresh. Entrance triggers now keep their scoped registration and use `play none none none`: they do not rewind or restart after completion, and route teardown removes them together. This avoids mutating the trigger list during initialization.

## Homepage quality pass

| Before | After | Why |
| --- | --- | --- |
| Large initials are the only central hero image | The supplied real portrait sits in a small paper-edged frame over the initials | Make the opening personal while retaining the existing composition |
| No visible route into the projects | Selected work is an explicit link in the first viewport | Make the main action clear |
| The portrait exists only on interior pages and avatars | The hero portrait has a restrained spring follow and separate entrance/scroll wrappers | Add depth without competing transform ownership |
| Large work titles have no sequence or directional cue | Quiet numbers and arrows refine the same broad links | Improve scanning without adding descriptive text |
| Some labels scale below readable sizes | Homepage captions and achievement labels have minimum font sizes | Keep the real work legible on intermediate screen widths |
| Globe meridians interpolate between manually scaled widths | Meridians rotate continuously around their vertical axes | Avoid the mechanical width changes |

Validation: local desktop plus 390px and 320px responsive frames; work jump, direct result images, readable text, forward/reverse scroll, footer reload and route teardown. The image source remains the original supplied PNG.
