import localFont from "next/font/local";

export const workSans = localFont({
  src: [
    {
      path: "/fonts/work-sans/WorkSans-VariableFont_wght.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-work-sans",
  display: "swap",
});

export const spaceGrotesk = localFont({
  src: [
    {
      path: "/fonts/space-grotesk/SpaceGrotesk-VariableFont_wght.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});
