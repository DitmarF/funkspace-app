import ThemeSwitcher from "@/components/ThemeSwitcher";
import PortfolioShell from "@/components/Layouts/PortfolioShell";

export default function Home() {
  return (
    <PortfolioShell>
      <div className="space-y-fs-2xl">
        <section
          id="start"
          aria-labelledby="start-heading"
          className="space-y-fs-lg"
        >
          <h1
            id="start-heading"
            className="text-3xl font-bold text-fs-action-primary"
          >
            FunkSpace
          </h1>
          <ThemeSwitcher />
        </section>
        <section
          id="about"
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
