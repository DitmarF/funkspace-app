import type { Metadata } from "next";
import "./globals.css";
import { workSans, spaceGrotesk } from "./fonts";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import { ThemeBootstrapScript } from "@/application/providers/ThemeBootstrapScript";
import { startIntroduction } from "@/data/startContent";

export const metadata: Metadata = {
  // FS-2.6 metadata is a review candidate; Dimi kept the titles as proposals.
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
      <body className="antialiased">
        <ThemeBootstrapScript />
        <ServiceProvider>{children}</ServiceProvider>
      </body>
    </html>
  );
}
