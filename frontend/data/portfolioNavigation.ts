import type { IconName } from "../components/Icons/Icon";
import { portfolioDestinations } from "./portfolioDestinations";

type NavigationRow = Readonly<{
  id: string;
  label: string;
  icon: IconName;
}>;

export type PortfolioNavigationItem = NavigationRow &
  (
    | {
        readonly kind: "link";
        readonly destination: keyof typeof portfolioDestinations;
      }
    | {
        readonly kind: "group";
        readonly children: readonly PortfolioNavigationItem[];
      }
    | { readonly kind: "pending" }
  );

// Labels belong to this navigation; hrefs retain the shared destination identities.
// Pending entries reuse their category artwork until item-specific artwork exists.
export const portfolioNavigation = [
  {
    id: "home",
    label: "Home",
    icon: "home",
    kind: "link",
    destination: "home",
  },
  {
    id: "about",
    label: "About",
    icon: "about",
    kind: "link",
    destination: "aboutPage",
  },
  {
    id: "animations",
    label: "Animations",
    icon: "animations",
    kind: "group",
    children: [
      {
        id: "first-animation",
        label: "First animation",
        icon: "animations",
        kind: "pending",
      },
      {
        id: "second-animation",
        label: "Second animation",
        icon: "animations",
        kind: "pending",
      },
    ],
  },
  {
    id: "games",
    label: "Games",
    icon: "games",
    kind: "group",
    children: [
      {
        id: "wave-survivor",
        label: "Wave Survivor",
        icon: "games",
        kind: "pending",
      },
      {
        id: "second-game",
        label: "Second game",
        icon: "games",
        kind: "pending",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: "privacy",
    kind: "group",
    children: [
      {
        id: "privacy-policy",
        label: "Privacy policy",
        icon: "privacy-policy",
        kind: "link",
        destination: "privacy",
      },
      {
        id: "imprint",
        label: "Legal notice",
        icon: "legal-notice",
        kind: "link",
        destination: "impressum",
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    icon: "contact",
    kind: "link",
    destination: "contact",
  },
] as const satisfies readonly PortfolioNavigationItem[];
