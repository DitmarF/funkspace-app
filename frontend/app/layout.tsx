import type { Metadata } from "next";
import "./globals.css";
import { workSans, spaceGrotesk } from "./fonts";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import { ThemeBootstrapScript } from "@/application/providers/ThemeBootstrapScript";
import { startIntroduction } from "@/data/startContent";

export const metadata: Metadata = {
  // Public identity and intended canonical address confirmed by Dimi, 2026-10-29.
  metadataBase: new URL("https://funkspace.de/"),
  title: "FunkSpace",
  description: startIntroduction,
  icons: { icon: { url: "/svg/fs/FunSpace_logo.svg", type: "image/svg+xml" } },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${workSans.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <ThemeBootstrapScript />
      </head>
      <body className="antialiased">
        <ServiceProvider>{children}</ServiceProvider>
      </body>
    </html>
  );
}
