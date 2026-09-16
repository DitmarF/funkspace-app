"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { FieldFrame, useField, type FieldContentProps } from "./field";
import styles from "./fields.module.css";

export type TextAreaFieldProps = Omit<
  ComponentPropsWithoutRef<"textarea">,
  "children" | "aria-invalid" | "aria-errormessage"
> &
  FieldContentProps;

const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  (
    {
      label,
      help,
      error,
      id,
      required,
      rows = 4,
      className = "",
      "aria-describedby": describedBy,
      ...props
    },
    ref,
  ) => {
    const field = useField({ id, help, error, describedBy });
    return (
      <FieldFrame
        label={label}
        help={help}
        error={error}
        required={required}
        field={field}
      >
        <textarea
          {...props}
          ref={ref}
          id={field.id}
          rows={rows}
          required={required}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid}
          className={`${styles.control} ${styles.textarea} ${className}`.trim()}
        />
      </FieldFrame>
    );
  },
);
TextAreaField.displayName = "TextAreaField";
export default TextAreaField;
