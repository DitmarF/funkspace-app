import type { ReactNode } from "react";

import Container from "../Layouts/Container";
import Text from "../Base/Text";
import Card from "../Modules/Card";
import Button from "../Controls/Button";

type Feature = {
  title: string;
  description: string;
};

export interface HomeTemplateProps {
  heroHeading: string;
  heroSubheading?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  features?: Feature[];
  footer?: ReactNode;
}

const HomeTemplate = ({
  heroHeading,
  heroSubheading,
  ctaLabel,
  onCtaClick,
  features = [],
  footer,
}: HomeTemplateProps) => (
  <main className="space-y-16 bg-[color:var(--fs-color-surface-background)] pb-16">
    <section className="border-b border-[color:var(--fs-color-grey-bright-2)] bg-[color:var(--fs-color-white)]">
      <Container width="wide" className="space-y-6 py-16 text-center">
        <Text size="lg" className="font-semibold sm:text-3xl">
          {heroHeading}
        </Text>
        {heroSubheading ? (
          <Text className="mx-auto max-w-2xl text-[color:var(--fs-color-content-elevation-2)]">
            {heroSubheading}
          </Text>
        ) : null}
        {ctaLabel ? (
          <div className="flex justify-center">
            <Button variant="primary" onClick={onCtaClick}>
              {ctaLabel}
            </Button>
          </div>
        ) : null}
      </Container>
    </section>
    {features.length > 0 ? (
      <section>
        <Container className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </Container>
      </section>
    ) : null}
    {footer ? (
      <footer>
        <Container width="narrow">{footer}</Container>
      </footer>
    ) : null}
  </main>
);

export default HomeTemplate;
