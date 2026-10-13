type Destination = Readonly<{
  label: string;
  focusId: string;
  href: `/${string}`;
}>;

// Keys are stable identities. Content readiness belongs in the FS-2.1 task
// record, not this contract.
export const portfolioDestinations = {
  home: { focusId: "main-content", label: "FunkSpace", href: "/" },
  aperture: {
    focusId: "main-content",
    label: "More about Web Aperture",
    href: "/animations/aperture",
  },
  start: { focusId: "start", label: "Start", href: "/#start" },
  about: { focusId: "about", label: "About", href: "/#about" },
  aboutPage: {
    focusId: "main-content",
    label: "More about FunkSpace",
    href: "/about",
  },
  impressum: {
    focusId: "main-content",
    label: "Legal notice",
    href: "/impressum",
  },
  privacy: { focusId: "main-content", label: "Privacy", href: "/privacy" },
  contact: { focusId: "main-content", label: "Contact", href: "/contact" },
} as const satisfies Record<string, Destination>;

export type PortfolioDestinationKey = keyof typeof portfolioDestinations;

/** Page identity excludes section anchors; Next supplies a query-free pathname. */
export function isCurrentPortfolioDestination(
  pathname: string | null,
  destination: PortfolioDestinationKey,
): boolean {
  return (
    pathname !== null &&
    (pathname.replace(/\/+$/, "") || "/") ===
      portfolioDestinations[destination].href
  );
}
