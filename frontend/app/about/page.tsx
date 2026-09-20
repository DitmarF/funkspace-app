import type { Metadata } from "next";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import { aboutContent } from "@/data/aboutContent";

export const metadata: Metadata = { title: "About FunkSpace" };

export default function AboutPage() {
  return (
    <PortfolioShell>
      <article className="max-w-prose space-y-fs-lg break-words">
        <h1 className="text-3xl font-bold">About FunkSpace</h1>
        <p className="text-sm leading-6">{aboutContent.draftNotice}</p>
        {aboutContent.paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-base leading-7">
            {paragraph}
          </p>
        ))}
      </article>
    </PortfolioShell>
  );
}
