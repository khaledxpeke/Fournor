# Accessibility failures

Lighthouse mobile, local production build, after the atelier dots were changed from `role="tablist"` to `role="group"`. No colour and no size was changed.

Homepage accessibility went from 87 to 92. The `aria-required-children` audit no longer applies. Gamme and product pages stayed at 94. What remains is listed below. Each fix is a token or a selector. None of these edits have been applied.

## Colour contrast

Rule: WCAG AA contrast (Lighthouse `color-contrast`). Normal text needs **4.5:1**. None of these are large text.

### Language switch, EN and AR

- Element: `header.site-header > div.header-tools > div.lang > a` (the inactive languages; FR is the current pill and passes)
- Selector: `.lang a`
- Token: `color: var(--text-soft)` which is `#6a655e`
- Current: `#6a655e` on the blended wash `#e7e2d9`, ratio **4.47:1**
- The wash is `var(--wash)` (`rgb(28 26 23 / 0.06)`) over the header glass, so the background is not a flat token
- Minimum: **4.5:1**
- Change `.lang a` only. Darkening `--text-soft` would also recolour every muted label that shares it
- Layout: no

### Marquee names

- Element: `div.marquee > div.marquee-track > span` (every product name in the strip)
- Selector: `.marquee-track span`
- The colour token is `--text-strong` (`#161412`). The failure is the opacity
- Current: `opacity: 0.55`, which composites to `#7a7771` on `--surface` (`#f4efe6`), ratio **3.89:1**, 21.6px
- Minimum: **4.5:1**, which this pair reaches at `opacity: 0.6` (composite about `#6f6c67`, ratio 4.56:1)
- Layout: no

### Gold tagline on the cream solution block

- Element: `div.mix-copy > p.pillar-tagline`, including `span.pillar-fit-ref` and the following span
- Selector: `.mix-copy .pillar-tagline`
- Token: `color: var(--accent)` which is `#f0c667`
- Inside `.mix-band` the same element is already `var(--text-strong)`. This failure is the copy that sits on `--surface`
- Current: `#f0c667` on `#f4efe6`, ratio **1.41:1**, 16px bold
- Minimum: **4.5:1**
- Point this selector at `var(--text-strong)`. Leave `--accent` alone, or the gold buttons and the mix band change too
- Layout: no

### “Fiche produit” on the gold mix band

- Element: `a.p-card > div.p-card-body > span.more` inside `section.mix-band`
- Selector: `.more`, and in this band the background is `.mix-band` (`var(--accent)`)
- Token: `color: var(--text-soft)` which is `#6a655e`
- Current: `#6a655e` on `#f0c667`, ratio **3.56:1**, 11.5px bold
- Minimum: **4.5:1**
- Set `.mix-band .more` to `var(--text-strong)`. That is already the text colour of the gold buttons, so it clears the bar without a new colour
- Layout: no

## Tap targets

Rule: WCAG 2.5.8 Target Size (Lighthouse `target-size`). Minimum **24×24 CSS pixels**, and the same clear space around the target.

- Element: `div#atelier-dots > button.atelier-dot` (one button per product: Baguette Fournor, Tradition, Mix croissant, Complet, Campagne, Céréales noir, Chia quinoa, Maxi graines, Multi céréales, Maïs)
- Selectors: `.atelier-dot` and `.atelier-dot.is-on`; the row gap is `.atelier-dots`
- Current: `width` and `height` are `0.48rem` (**7.7×7.7px**). The active dot is `width: 1.25rem` (**20×7.7px**). Gap is `0.4rem`, so the clear space is about **4.2px** (the active dot has about **16.4px**)
- Minimum: **24×24px**, with **24px** of clear space
- There is no colour token for this. The sizes are on those three rules
- Layout: yes. A 24px dot and a 24px gap make the row taller and wider

## Heading order

Fixed. Gamme cards under the page `h1` are `h2`, and the product specification labels are `h2`. The size rules moved with the tags (`.p-card-body h2` keeps `1.28rem`; `.prod-specs h2` keeps `0.68rem` and `line-height: 1.2`). Homepage cards stay `h3` because they already sit under an `h2`.
