import type { Metadata } from "next";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import ApertureDetails from "@/components/sections/ApertureDetails";

export const metadata: Metadata = {
  title: "Web Aperture — FunkSpace",
  description:
    "Explore the WEB particle scene and adjust its density, speed and size for this visit.",
};

export default function AperturePage() {
  return (
    <PortfolioShell sceneCustomization>
      <ApertureDetails />
    </PortfolioShell>
  );
}
