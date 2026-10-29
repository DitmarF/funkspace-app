import Text from "../Base/Text";
import styles from "./fields.module.css";

export type InlineStatusProps = {
  /** Keep this component mounted; update only when the consumer's message changes. */
  message?: string;
  id?: string;
  className?: string;
};

export default function InlineStatus({
  message = "",
  id,
  className = "",
}: InlineStatusProps) {
  // No effects, timers, focus movement, or field-error announcements.
  return (
    <Text
      id={id}
      size="sm"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`${styles.status} ${className}`.trim()}
    >
      {message}
    </Text>
  );
}
