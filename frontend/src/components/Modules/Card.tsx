import type { ReactNode } from "react";

import Text from "../Base/Text";
import Button from "../Controls/Button";

interface CardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const Card = ({
  title,
  description,
  children,
  actionLabel,
  onAction,
}: CardProps) => (
  <article className="flex flex-col gap-4 rounded-2xl border border-[color:var(--fs-color-grey-bright-2)] bg-[color:var(--fs-color-white)] p-6 shadow-sm">
    <header className="space-y-2">
      <Text size="lg" className="font-semibold">
        {title}
      </Text>
      {description ? (
        <Text className="text-[color:var(--fs-color-content-elevation-2)]">
          {description}
        </Text>
      ) : null}
    </header>
    {children ? <div className="flex-1 space-y-3">{children}</div> : null}
    {actionLabel ? (
      <footer>
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      </footer>
    ) : null}
  </article>
);

export type { CardProps };
export default Card;
