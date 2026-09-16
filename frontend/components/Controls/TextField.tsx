"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { FieldFrame, useField, type FieldContentProps } from "./field";
import styles from "./fields.module.css";

export type TextFieldProps = Omit<
  ComponentPropsWithoutRef<"input">,
  "type" | "children" | "aria-invalid" | "aria-errormessage"
> &
  FieldContentProps & { type?: "text" | "email" };

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      help,
      error,
      id,
      required,
      type = "text",
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
        <input
          {...props}
          ref={ref}
          id={field.id}
          type={type}
          required={required}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid}
          className={`${styles.control} ${className}`.trim()}
        />
      </FieldFrame>
    );
  },
);
TextField.displayName = "TextField";
export default TextField;
