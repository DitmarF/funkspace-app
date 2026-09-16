import { useId, type ReactNode } from "react";
import Text from "../Base/Text";
import styles from "./fields.module.css";

export type FieldContentProps = {
  label: string;
  help?: string;
  /** An actual caller-supplied error, including a later server-derived message. */
  error?: string;
};

export function useField({
  id,
  help,
  error,
  describedBy,
}: {
  id?: string;
  help?: string;
  error?: string;
  describedBy?: string;
}) {
  const generated = useId();
  const helpId = help?.trim() ? `${generated}-help` : undefined;
  const errorId = error?.trim() ? `${generated}-error` : undefined;
  const descriptionIds = [
    ...new Set([
      ...(describedBy?.split(/\s+/).filter(Boolean) ?? []),
      ...(helpId ? [helpId] : []),
      ...(errorId ? [errorId] : []),
    ]),
  ].join(" ");
  return {
    id: id ?? `${generated}-field`,
    helpId,
    errorId,
    describedBy: descriptionIds || undefined,
    invalid: errorId ? true : undefined,
  };
}

export function FieldFrame({
  label,
  required,
  help,
  error,
  field,
  children,
}: FieldContentProps & {
  required?: boolean;
  field: ReturnType<typeof useField>;
  children: ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={field.id}>
        {label}
        {required ? <span> (required)</span> : null}
      </label>
      {children}
      {field.helpId ? (
        <Text id={field.helpId} size="sm" className={styles.message}>
          {help}
        </Text>
      ) : null}
      {field.errorId ? (
        <Text id={field.errorId} size="sm" className={styles.message}>
          <strong>Error:</strong> {error}
        </Text>
      ) : null}
    </div>
  );
}
