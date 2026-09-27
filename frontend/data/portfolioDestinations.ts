type Destination = Readonly<{
  label: string;
  focusId: string;
  href: `/${string}`;
}>;

// Keys are stable identities. Content readiness belongs in the FS-2.1 task
// record, not this contract.
export const portfolioDestinations = {
  home: { focusId: "main-content", label: "FunkSpace", href: "/" },
  start: { focusId: "start", label: "Start", href: "/#start" },
  about: { focusId: "about", label: "About", href: "/#about" },
  contact: { focusId: "contact", label: "Contact", href: "/#contact" },
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
} as const satisfies Record<string, Destination>;

export type PortfolioDestinationKey = keyof typeof portfolioDestinations;
