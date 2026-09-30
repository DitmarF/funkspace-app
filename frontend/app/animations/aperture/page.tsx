import type { Metadata } from "next";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import StartScene from "@/components/Scene/StartScene";

export const metadata: Metadata = {
  title: "Aperture - 1 — FunkSpace",
  description:
    "Explore the WEB particle scene and adjust its density, speed and size for this visit.",
};

export default function AperturePage() {
  return (
    <PortfolioShell sceneCustomization>
      <article className="space-y-fs-lg" aria-labelledby="aperture-title">
        <h1 id="aperture-title" className="text-3xl font-bold">
          Aperture - 1
        </h1>
        <p>
          Explore the WEB particle scene. Customize its density, speed and size
          for this visit.
        </p>
        <StartScene customizable />
      </article>
    </PortfolioShell>
  );
}
