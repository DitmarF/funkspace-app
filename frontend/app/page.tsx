import Start from "@/components/sections/Start";
import PortfolioShell from "@/components/Layouts/PortfolioShell";

export default function Home() {
  return (
    <PortfolioShell>
      <div className="space-y-fs-2xl">
        <Start />
        <section
          id="about"
          tabIndex={-1}
          aria-labelledby="about-heading"
          className="space-y-fs-md"
        >
          <h2 id="about-heading" className="text-2xl font-bold">
            About
          </h2>
          <p className="text-base leading-7">
            FunkSpace is a design-system-first web experience.
          </p>
        </section>
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
