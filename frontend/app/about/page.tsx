import type { Metadata } from "next";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import { aboutContent } from "@/data/aboutContent";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About FunkSpace",
  description: aboutContent.description,
};

export default function AboutPage() {
  return (
    <PortfolioShell>
      <article
        className={`${styles.article} max-w-prose space-y-fs-lg break-words`}
      >
        <h1 className="text-3xl font-bold">About FunkSpace</h1>
        {aboutContent.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-portfolio-body">
            {paragraph}
          </p>
        ))}
        {aboutContent.sections.map((section) => (
          <section key={section.heading} className="space-y-fs-md">
            <h2 className="text-2xl font-bold">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-portfolio-body">
                {paragraph}
              </p>
            ))}
            {"quote" in section && (
              <figure className="text-portfolio-body space-y-fs-md">
                <blockquote>
                  <p>{section.quote.text}</p>
                </blockquote>
                <figcaption>— {section.quote.attribution}</figcaption>
              </figure>
            )}
          </section>
        ))}
      </article>
    </PortfolioShell>
  );
}
