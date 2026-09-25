import Button from "../Controls/Button";
import styles from "./PortfolioNavigation.module.css";

/** Presentation contract only. FS-3.4 owns the future live policy and storage. */
export type MotionChoice = "system" | "reduced" | "off";
export interface MotionChoicesProps {
  value: MotionChoice;
  onChange(value: MotionChoice): void;
}

export default function MotionChoices({ value, onChange }: MotionChoicesProps) {
  return (
    <fieldset className={styles.group}>
      <legend>Motion</legend>
      <div className={styles.choices}>
        {(
          [
            ["system", "Follow system"],
            ["reduced", "Reduced"],
            ["off", "Off"],
          ] as const
        ).map(([choice, label]) => (
          <Button
            key={choice}
            variant="outlined"
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
