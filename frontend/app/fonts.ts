import localFont from "next/font/local";

export const workSans = localFont({
  src: [
    {
      path: "../public/fonts/Work_Sans/WorkSans-VariableFont_wght.ttf",
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
      path: "../public/fonts/Space_Grotesk/SpaceGrotesk-VariableFont_wght.ttf",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});
