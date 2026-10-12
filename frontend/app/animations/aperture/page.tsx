import type { Metadata } from "next";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import StartScene from "@/components/Scene/StartScene";

export const metadata: Metadata = {
  title: "Web Aperture — FunkSpace",
  description:
    "Explore the WEB particle scene and adjust its density, speed and size for this visit.",
};

export default function AperturePage() {
  return (
    <PortfolioShell sceneCustomization>
      <article className="space-y-fs-lg" aria-labelledby="aperture-title">
        <h1 id="aperture-title" className="text-2xl font-bold">
          Web Aperture
        </h1>
        <p className="text-portfolio-body">
          Explore the WEB particle scene. Customize its density, speed and size
          for this visit.
        </p>
        <StartScene customizable />
      </article>
    </PortfolioShell>
  );
}
