import Button, { type ButtonProps } from "../Controls/Button";
import styles from "./PortfolioNavigation.module.css";
import {
  MOTION_CHOICES,
  type MotionPreference,
} from "@/domain/motion/MotionPolicy";

/** Controlled presentation; the shared service owns live preference and storage. */
export type MotionChoice = MotionPreference;
export interface MotionChoicesProps {
  value: MotionChoice;
  onChange(value: MotionChoice): void;
  disabled?: boolean;
  presentation?: "outlined" | "secondary";
  size?: ButtonProps["size"];
}

export default function MotionChoices({
  value,
  onChange,
  disabled = false,
  presentation = "outlined",
  size,
}: MotionChoicesProps) {
  return (
    <fieldset className={styles.group}>
      <legend>Motion</legend>
      <div className={styles.choices} data-presentation={presentation}>
        {MOTION_CHOICES.map(({ value: choice, label }) => (
          <Button
            key={choice}
            variant={presentation}
            size={size}
            disabled={disabled}
            aria-pressed={value === choice}
            onClick={() => onChange(choice)}
          >
            {label}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
