# Mobile-First Densify Summary — PR #16

## Implementation Status: ✅ COMPLETE (HOLD for CoS craft shots)

### Critical Mobile Changes (375-430px)

#### 1. Hero Padding Reduction
- **Before**: `clamp(4rem, 12vh, 8rem)` → ~80-120px on mobile
- **After**: `1.25rem` (20px) on mobile
- **Impact**: Proof + primary CTA now visible in first fold on 375/390px

#### 2. 2×2 Proof Strip (NEW)
```
Structure:
┌─────────────┬─────────────┐
│ 43% → 1%    │ false       │
│ Phase 6B    │ safety_acc. │
├─────────────┼─────────────┤
│ Phase 11·   │ Sim-only    │
│ P14R        │ Archive     │
└─────────────┴─────────────┘
```
- Grid: `1fr 1fr`, gap `0.5rem`
- Max height: `88px`
- Position: Between lede and CTAs
- Hidden on desktop (≥900px)

#### 3. CTA Layout (EXACT SPEC)
```css
@media (max-width:640px){
  .cta-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
  .btn-primary { grid-column: 1 / -1; }
}
```
**Result**:
- Primary "Enter AegisLand" → full width
- Secondary "Cockpit" + Ghost "Email" → side-by-side
- NOT 3 stacked full-width buttons ✅

#### 4. Button Accessibility
- All buttons: `min-height: 44px`
- Aria-labels: full descriptive names
- No ellipsis or truncation

#### 5. Typography Scale
- H1: `1.75rem` (28px) mobile → `4.2rem` desktop
- Kicker: `0.69rem` (11px)
- Lede: shortened to ~140 characters

#### 6. Flagship Mobile Optimization
- Cover: `max-height: 180px` on ≤640px
- Inline metric pills BEFORE long blurb
- Same 1+2 CTA grid pattern
- Padding: `1rem` mobile, `2rem` desktop

#### 7. Section Padding Tightening
- Mobile: `3rem` (48px) — was `4.5rem` min
- Desktop: `4-5rem` (64-80px) — was `5-8rem`

### Desktop Enhancements (≥900px)

#### Hero 2-Column Layout
- Grid: `1.1fr / 0.9fr`
- **Left**: Content + proof strip (hidden) + CTAs
- **Right Rail** (NEW):
  - Chart cover (16:10)
  - 2×2 mini-bento:
    ```
    43% → 1%     | 84.2% → 2.4%
    Phase 6B     | V3 arch
    
    false        | Frozen
    safety_acc.  | Holdouts
    ```

### Work Cards — Evidence Upgrade

**Before**: Emoji placeholders (📱🎮🏆)
**After**: Real evidence images + metrics

#### All Cards Now Have:
1. **Real thumbnails** (16:10 aspect ratio):
   - Elodin: aegisland/cover.jpg
   - AbstainBench: abstain/cover.svg
   - StudySync: chart_uncertainty_light.png
   - Game Jam: chart_v3_light.png
   - SkillsUSA: frame_home.png
   - ECHO/FIELD: echo/cover.jpg

2. **Status badges** with specifics:
   - `Merged PR #769`
   - `Frozen holdout`
   - `2nd place`
   - `1st Regional`

3. **Metric chips** (verified numbers):
   - `Merged` + `2026`
   - `30 questions` + `Local eval`
   - `~200 peak users` + `2025`
   - `2nd place` + `2025`
   - `1st Regional` + `16th CA State`
   - `WebAudio` + `Generative`

4. **Stack chips** (technology)

### Density Principles Applied

From tachyon.dk / kishoresv.com:
- ✅ **Metrics first**: Numbers before prose
- ✅ **Labeled data**: Every metric has context
- ✅ **Tight vertical rhythm**: Reduced padding, compact spacing
- ✅ **Evidence per card**: Real thumbnails + verified numbers
- ✅ **Interleaved content**: Proof between lede and CTAs (mobile)
- ✅ **No empty bento cells**: Desktop rail fully populated

### Theme & Accuracy Preserved

#### Theme Lock
- Forest: `#2f4a3c`
- Copper: `#a67c4e`
- Cream: `#f4efe6`

#### Typography
- Display: Fraunces (600-700)
- Mono: IBM Plex Mono (400-500)
- Body: Source Sans 3 (400-600)

#### Accuracy
- ✅ Cruze = Fleet Outreach & BD Intern
- ✅ Seagulls = AI Engineer Intern
- ✅ Sim-only labels maintained
- ✅ No invented awards
- ✅ All metrics verified

#### Banned
- ❌ Three.js / WebGL
- ❌ Particles / GSAP
- ❌ Iframe embeds

### Ship Gate Checklist

**HOLD MERGE** until CoS craft screenshots:
- [ ] Mobile hero 375px
- [ ] Mobile hero 430px (or 390px)
- [ ] Mobile flagship 375px
- [ ] Desktop hero (right rail filled)
- [ ] Desktop work grid

**Craft-Ready Criteria**:
- [ ] First fold 375px: proof strip + primary CTA visible
- [ ] Mobile CTAs: 1 full-width + 2 side-by-side (NOT 3 stacked)
- [ ] No truncated button text
- [ ] Desktop rail: cover + 2×2 bento (no empty cream)
- [ ] All work cards: real thumbs + metrics
- [ ] Flagship cover: clean chart (not busy cockpit chrome)

### Files Changed
- `index.html`: Hero structure, flagship layout, work card content
- `css/site.css`: Mobile-first responsive, proof strip, hero rail, metrics

### Technical Implementation
- Rebased on `main` @ 97fe53fc (post-#15 merge)
- Mobile-first CSS: breakpoints at 640px and 900px
- Grid layouts for CTA rows (mobile spec compliant)
- Conditional rendering: proof strip (mobile), hero rail (desktop)
- Zero new dependencies
- All changes in 2 files

---

**Status**: Implementation complete. Awaiting CoS craft validation with 375/430/desktop shots before merge.
