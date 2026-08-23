# Portfolio Pass B — V3 Vast Quiet bodies

Local-only scaffolding. **No git PR from this pass** — Dev Bot owns the PR lift onto branch `cursor/five-style-variants-21a3`.

## Direction lock (CONFIRMED)

**V3 vast quiet cinematic** — NOT print-tech, NOT Theme #17.

Base feel: `/workspace/suhas-drafts/portfolio-pass-a/v3-vast-quiet.html`

| Token | Value |
|-------|-------|
| Void | `#0c0c0b` |
| Fog | `#8a8780` |
| Mist | `#2a2926` |
| Bone | `#e8e4dc` |
| Whisper | `#c4bfb4` |
| Display | Instrument Serif |
| Body | DM Sans |

Sparse dark field · long breathing room · cinematic quiet. No ledger paper, no cream/forest/copper, no neon lime.

## Output root

```
/workspace/suhas-drafts/portfolio-pass-b/
```

## Deliverables

| File | Body / layout |
|------|----------------|
| `b1-monument-stack.html` | Monumental stacked vertical: huge hero, sparse full-bleed sections, huge margins |
| `b2-asymmetric-rail.html` | Left thin meta rail + right long content column (still dark/quiet) |
| `b3-chapter-void.html` | Chapter breaks as near-empty voids between content islands; extreme whitespace |
| `compare.html` | 3-up iframes + notes + recommendation banner |
| `shots/` | Playwright screenshots (heroes, Aegis, compare) |
| `README.md` | This file |

Leftover print-tech `b1-ledger-columns.html` was cleared before writing these files.

## Section order (every landing)

1. Hero  
2. Featured Aegis (sim-only)  
3. Projects  
4. Experience  
5. Wins  
6. Contact  

## Content truth (honesty locks)

Do **not** invent beyond this:

- **Name:** Suhas Beemineni · RIHS '29 · SJ Delta  
- **AegisLand:** simulation-only research cockpit; `safety_acceptance: false`; Phase 6B unsafe **43% → 1%**; frozen holdouts  
- **Cruze:** Fleet Outreach & BD  
- **Seagulls / OpenStage:** AI Engineer Intern  
- **CTA:** Email `suhas.aug20@gmail.com`  

### Explicit bans

- No Elodin  
- No flight-software claims  
- No neon lime-on-charcoal  
- No Inter-as-display  
- No purple/blue SaaS gradients  
- No 3D blobs  
- No fake browser chrome spam  
- No Theme #17 cream/forest/copper  
- No print-tech / ledger paper  

## Preview locally

```bash
cd /workspace/suhas-drafts/portfolio-pass-b
python3 -m http.server 8766
# open http://127.0.0.1:8766/compare.html
```

## Screenshots

Captured at 1440×900 (heroes + Aegis mid-pages). Compare page full-page / wider.

```
shots/b1-hero.png  shots/b2-hero.png  shots/b3-hero.png
shots/b1-aegis.png shots/b2-aegis.png shots/b3-aegis.png
shots/compare.png
```

## How Dev Bot lifts into a PR

1. Copy this folder (or selected winner HTML) into the real portfolio repo path Dev Bot owns.  
2. Target branch: **`cursor/five-style-variants-21a3`**.  
3. Do **not** re-author claims — keep honesty locks above.  
4. Prefer **B1 Monument Stack** unless craft review clearly favors B3 Chapter Void.  
5. Do not reintroduce Theme #17 or print-tech.  
6. Open the PR from Dev Bot's workflow; this Pass B tree stays draft/local.  
7. Optionally attach `shots/` for design review in the PR description.

## Recommendation (Pass B)

**Ship B1 Monument Stack (`b1-monument-stack.html`)** as the strongest V3 body layout — monumental hero + sparse full-bleed sections with huge breathing room, closest amplification of Pass A v3. **B3 Chapter Void** is the strong alternate for extreme quiet; **B2 Asymmetric Rail** is distinctive but more UI-structural than pure cinematic void.
