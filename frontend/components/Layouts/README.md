# Portfolio sections

Use `PortfolioSection` for content-driven sections with ordinary page scrolling.
It accepts native `<section>` props, including `id`, `aria-labelledby`, `tabIndex`,
`className` and children. Callers supply the heading and accessible name.

| Variant           | Use                                                      | Current example |
| ----------------- | -------------------------------------------------------- | --------------- |
| `plain` (default) | Static content with a few actions                        | About preview   |
| `cornered`        | Interactive content with settings or navigation controls | WEB / Start     |

```tsx
<PortfolioSection variant="cornered" aria-labelledby="scene-title">
  <h2 id="scene-title">Interactive experience</h2>
  {/* Artwork and controls */}
</PortfolioSection>
```

Both variants share responsive semantic-token padding. `cornered` adds the
existing four SVG marks, hidden from assistive technology, unfocusable and
non-intercepting. `plain` renders no corner SVGs. Neither owns motion, settings,
focus management or a fixed viewport height. Keep interactive controls outside
any decorative `aria-hidden` subtree.

Storybook **Layouts/PortfolioSection** includes Plain, Cornered and the actual
homepage pair. Use its theme toolbar to inspect Default, Dark, Muted and High
Contrast. Existing Start/About stories also show their selected variants.
`SnapSection` remains a separate legacy/demo scroll-snap primitive; it is not the
portfolio section foundation.

Contact is removed from the homepage and active navigation pending EPIC 5's new
concept. Legal-page email links remain available. See the
[task record](../../../docs/tasks/maintenance-section-variants.md) for scope and
validation evidence.
