# ALLURE — Maison de Parfum

A complete brand + website design for **Allure**, a luxury cologne house.
Visual system **"Gilded Noir"** — palette extracted from the supplied reference,
motion built on Apple's fluid-interface principles.

**Run it:** open `index.html` in a browser (or `python3 -m http.server`). No build step.

```
index.html          Full homepage (nav, hero, collection, maison, CTA, contact, footer)
css/styles.css      "Gilded Noir" design system + Apple-style materials & motion
js/main.js          Product data, scroll reveals, translucent nav, interruptible tilt
assets/
  favicon.svg         Icon-only mark (A monogram on noir tile) — favicon / social
  logo-monogram.svg   Crest / icon-only lockup
  logo-wordmark.svg   Horizontal wordmark lockup
```

---

## 1. Logo Design Concept

**Concept — "The Gilded A."** A serif capital *A* whose crossbar is treated as a
gilded threshold, set inside a fine double-crest ring, with a single rising
"fragrance note" stroke in ivory above the bar — evoking scent lifting off the skin.

- **Primary lockup** — crest monogram above the tracked wordmark *ALLURE* with the
  descriptor *MAISON DE PARFUM* (`logo-wordmark.svg` + `logo-monogram.svg`).
- **Wordmark variation** — *ALLURE* in Cormorant Garamond, `letter-spacing` ~0.14em,
  gold gradient. Works standalone in the nav and footer.
- **Icon-only** — the crest monogram; on a noir rounded tile it becomes the favicon
  and social avatar (`favicon.svg`).
- **Monochrome** — the same paths render in single-ink gold, ivory, or noir for
  embossing, foil, and single-colour print.

**Colours used:** gold gradient `#E8D6B3 → #C9A84C → #A8862F`, on `#111111`, accent ivory `#F8F5EF`.

**Rationale.** "Allure" is about magnetism, so the mark leads with a confident,
high-contrast serif letterform rather than an illustrative bottle. The crest ring
signals *maison* heritage; the gold gradient reads as real gilding; the ivory note
stroke ties the abstract mark to fragrance. Because it's built from simple vector
paths with generous negative space, it stays legible from a **16px favicon to a
billboard**, and inverts cleanly for light or dark backgrounds.

## 2. Website Design Overview

**Palette (from the reference image):**

| Token | Hex | Role |
| --- | --- | --- |
| Noir Black | `#111111` | Page background |
| Charcoal | `#2E2E2E` | Surfaces, cards, gradients |
| Antique Gold | `#C9A84C` | Primary accent, CTAs, rules |
| Champagne | `#E8D6B3` | Gold highlight, gradient light-stop |
| Ivory | `#F8F5EF` | Primary text |

**Typography.** Display/serif **Cormorant Garamond** (elegant, high-contrast — the
luxury voice); UI/sans **Jost** (geometric, quiet) with `system-ui` fallback.
Tracking is size-specific per Apple's type guidance — negative on the huge display
head (`-0.02em`), wide on small uppercase eyebrows (`0.42em`), near-zero on body.

**Key visual elements.** Deep noir canvas; gold gradient reserved for what matters
(CTAs, the mark, hairline rules); soft radial "auras" instead of flat fills for
depth; CSS/SVG glass bottles as placeholders for real product photography; a
translucent blurred nav that content scrolls beneath.

## 3. Homepage Structure

- **Header & Navigation** — fixed, translucent (`backdrop-filter: blur`), content
  passes beneath it (Apple material layer). It thickens from ~28% to ~72% opacity on
  scroll. Collapses to a right-side blurred drawer on mobile.
- **Hero** — full-viewport (`100svh`) statement: eyebrow, oversized serif headline
  *"Wear the night & the gold."*, sub-copy, dual CTA (gold primary + ghost). Drifting
  gold aura kept far under the vestibular-motion threshold.
- **Collection** — responsive auto-fit grid of four extraits; each card has a CSS/SVG
  bottle, notes, description, price, and an *Add* button with completion feedback.
  Cards lift and, on fine pointers, tilt 1:1 toward the cursor via an interruptible
  spring (reads the live value each frame — no jump on grab/release).
- **Maison / Brand Story** — two-column narrative with a monogram media panel and
  three proof stats (maturation, concentration, hand-finished).
- **CTA / Discover** — gilded band with an atelier-list email capture and inline
  validation feedback.
- **Contact / Purchase** — flagship boutique, online boutique, and concierge cards.
- **Footer** — wordmark, four link columns, legal + social line.

## 4. Design Summary

- **Luxury positioning** comes from restraint: a near-black canvas, one metallic
  accent used sparingly, oversized serif display type, and generous whitespace —
  the visual grammar of a fragrance house, not a mass retailer.
- **The colour reference** is used verbatim as CSS custom properties — every colour
  on the page is one of the five swatches (or a gradient between champagne and gold).
- **The Apple-UI skill** shaped the motion and materials: feedback on pointer-down
  (`:active` scale), a translucent chrome layer content scrolls under, spring-style
  easing curves, an *interruptible* tilt that animates from the presentation value,
  and full `prefers-reduced-motion` / `-transparency` / `-contrast` fallbacks.
- **Responsive & accessible** — `svh` units, `clamp()` fluid type/spacing in `rem`,
  auto-fit grids, a mobile drawer, visible focus rings, and reduced-motion paths.

**Next steps:** commission real bottle + campaign photography to replace the SVG
placeholders; wire the forms and cart to a commerce backend (Shopify/commerce API);
add product detail pages and a Journal; run the palette through a contrast audit for
any future light-mode surfaces.
