import Start from "@/components/sections/Start";
import AboutPreview from "@/components/sections/AboutPreview";
import PortfolioShell from "@/components/Layouts/PortfolioShell";

export default function Home() {
  return (
    <PortfolioShell>
      <div className="space-y-fs-2xl">
        <Start />
        <AboutPreview />
        <section
          id="contact"
          tabIndex={-1}
          aria-labelledby="contact-heading"
          className="space-y-fs-md"
        >
          <h2 id="contact-heading" className="text-2xl font-bold">
            Contact
          </h2>
          <p className="text-base leading-7">
            A public contact address is not available yet.
          </p>
        </section>
      </div>
    </PortfolioShell>
  );
}
