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

## Footer navigation

`PortfolioFooterNavigation` supplies three centered native links: Legal notice
(`/impressum`), Privacy policy (`/privacy`) and the icon-only FunkSpace project
link to `https://github.com/DitmarF/funkspace-app`. The GitHub link has an
accessible name that announces it opens in a new tab; it makes no external
request until activated. Legal content and publication readiness are unchanged.

The footer reuses compact navigation-row styling with registered 24px legal
icons and the next-size 36px GitHub artwork,
including borderless Work Sans labels, semantic hover colors and visible focus.
Links remain native anchors even on the current legal page, preserving the
existing footer contract. The centered flex layout wraps at narrow widths, with
32px horizontal gaps on mobile and 48px on tablet/desktop. Mobile bottom padding
is one `--fs-space-2xl` plus the bottom safe area; tablet/desktop retain their
existing padding.
GitHub occupies its own centered row on mobile so the tighter gutter does not
put its target behind the fixed settings button. Tablet/desktop use one row.
When enlarged text leaves less than 16em of footer width, the mobile social row
reserves the settings control's remaining vertical overlap. This adds no space
at ordinary text size on supported 320px-and-wider screens.

Storybook **Layouts/PortfolioFooterNavigation** exposes Default and InShell;
the latter exercises the complete responsive footer and settings control.
See the [footer task record](../../../docs/tasks/maintenance-footer-navigation.md).

## Header and tree navigation

At `48rem` and above the enhanced shell keeps the header and settings launcher
available through a directional sticky header: down hides after 32px of travel,
up reveals after 12px, with the opening header always shown near the top.
Focus and open navigation pin it. Wheel/touch scrolling releases the focus pin
without moving focus, so closing settings after Off → On resumes scroll behavior;
new focus or keyboard use immediately pins and reveals the controls again.
Existing motion-policy permission controls the
400ms transform; Reduced, Off and system reduction use a stationary sticky header.
The measured height reserves focus/anchor clearance without changing content flow.
On initial enhancement, a fragment target covered by the header is scrolled clear
once without moving focus. History restoration and subsequent resize/scroll retain
their positions.
Mobile, no-JS and short viewports with a header taller than half the viewport retain
native scrolling. **SmartStickyHeader** is the long-page Storybook example.
See the [behavior and validation record](../../../docs/tasks/maintenance-smart-sticky-header.md).

`PortfolioMainNavigation` supplies Home, About and Contact in the
shared header. It and `PortfolioNavigationTree` reuse `portfolioMainNavigation`
data and `PortfolioNavigationRow`, including icon artwork, typography, semantic
colors, hover/focus styling and native disabled buttons. The compact header
rows omit the tree's disclosure-arrow gutter; their icons remain on the left.
Header rows use the 24px artwork at every breakpoint. Tree rows use the same
24px text, 36px artwork and 24px disclosure arrows on phones, tablets and desktops;
the compact header keeps its existing responsive text and row sizing.

The header landmark is named **Main**; the complete tree remains **Primary**.
Home, About and Contact target `/`, `/about` and `/contact` and use the existing
provider-owned navigation handoff when navigating to another page. Contact follows
the same current-page disabling/focus behavior in both navigations. Wave Survivor
remains a noninteractive Coming soon entry; the second animation and second game
placeholders were removed at Dimi’s request.

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
**InHeader** composition. The existing tree/shell stories show the Contact route
and the shared header too. Main navigation adds **AboutActive** and **ContactActive**;
the tree adds **AboutActive**, **ContactActive** and **ApertureActive**, with route context supplied by Storybook.
See the [task record](../../../docs/tasks/maintenance-main-navigation.md).
