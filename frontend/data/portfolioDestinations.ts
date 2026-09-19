type Destination = Readonly<{
  label: string;
  href: `/${string}`;
}>;

// Keys are stable identities. Content readiness belongs in the FS-2.1 task
// record, not this contract.
export const portfolioDestinations = {
  home: { label: "FunkSpace", href: "/" },
  start: { label: "Start", href: "/#start" },
  about: { label: "About", href: "/#about" },
  contact: { label: "Contact", href: "/#contact" },
  aboutPage: { label: "More about FunkSpace", href: "/about" },
  impressum: { label: "Impressum", href: "/impressum" },
  privacy: { label: "Privacy", href: "/privacy" },
} as const satisfies Record<string, Destination>;
