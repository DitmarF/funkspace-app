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

Contact is removed from the homepage pending EPIC 5's new concept. Legal-page
email links remain available. See the
[task record](../../../docs/tasks/maintenance-section-variants.md) for scope and
validation evidence.

## Header and tree navigation

`PortfolioMainNavigation` supplies Home, About and disabled Contact in the
shared header. It and `PortfolioNavigationTree` reuse `portfolioMainNavigation`
data and `PortfolioNavigationRow`, including icon artwork, typography, semantic
colors, hover/focus styling and native disabled buttons. The compact header
rows omit the tree's disclosure-arrow gutter; their icons remain on the left.
Header rows use the 24px artwork at every breakpoint; desktop tree rows retain
their 36px artwork.

The header landmark is named **Main**; the complete tree remains **Primary**.
Home and About target `/` and `/about` and use the existing provider-owned
navigation handoff when navigating to another page. Contact has no destination,
activation handler or keyboard tab stop in either navigation. The other future
tree entries keep their existing noninteractive Coming soon presentation.

The current page is a native disabled button with `aria-current="page"`, no
URL and no tab stop in both navigations. Its icon uses the semantic hover color;
text retains its normal weight/color. Next's current pathname supplies the
state during server rendering and client navigation. Exact path matching keeps
Home inactive on other pages; queries/fragments do not enable reselecting the
same page. Section-anchor links remain links. Other destinations, footer links
and the logo retain their existing behavior. See the [active-state task](../../../docs/tasks/maintenance-active-navigation.md).

The tree opens the current page's ancestor groups on entry, so an animation
reached through Home's More link is immediately visible when navigation opens.
This also works for direct visits and without JavaScript. Groups remain native
disclosures that users can close or reopen; a pathname change resets them to
reveal the new current page.

The Navigation and Accessibility overlay headings use the existing Work Sans
font; Appearance and Motion legends retain their existing typography.

The WEB animation's **Web Aperture** row uses the dedicated `s-web` icon. The
Animations parent retains its category icon; Games uses the updated library
artwork. See the [icon source register](../Icons/README.md).

At `48rem` and above, header links sit right of the logo and left of the settings
hex, with `2 × --fs-space-md` between buttons. Below that breakpoint, the logo
is on the left and the three buttons are stacked vertically on the right, with
their centers aligned vertically. The logo can shrink to its column and labels
can wrap with enlarged text. The settings hex remains fixed at bottom right.
Header links participate in the homepage's existing content reveal.

Storybook **Layouts/PortfolioMainNavigation** includes the standalone row and
**InHeader** composition. The existing tree/shell stories show disabled Contact
and the shared header too. Main navigation adds **AboutActive**; the tree adds
**AboutActive** and **ApertureActive**, with route context supplied by Storybook.
See the [task record](../../../docs/tasks/maintenance-main-navigation.md).
