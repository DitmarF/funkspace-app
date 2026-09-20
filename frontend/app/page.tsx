import Start from "@/components/sections/Start";
import AboutPreview from "@/components/sections/AboutPreview";
import Contact from "@/components/sections/Contact";
import PortfolioShell from "@/components/Layouts/PortfolioShell";

export default function Home() {
  return (
    <PortfolioShell>
      <div className="space-y-fs-2xl">
        <Start />
        <AboutPreview />
        <Contact />
      </div>
    </PortfolioShell>
  );
}
