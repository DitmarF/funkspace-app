"use client";

import { useId, useRef, type ReactNode } from "react";
import { useDialog, type DialogBehavior } from "@/hooks/useDialog";
import HexButton from "./HexButton";
import styles from "./Dialog.module.css";

export interface DialogProps extends DialogBehavior {
  title: string;
  /** Keep the accessible title but use Close as the default initial focus. */
  hideTitle?: boolean;
  /** Presentation only; modal focus and scroll ownership stay in the binding. */
  presentation?: "panel" | "fullscreen";
  className?: string;
  description?: string;
  children: ReactNode;
}

export default function Dialog({
  title,
  hideTitle = false,
  description,
  children,
  presentation = "panel",
  className = "",
  ...behavior
}: DialogProps) {
  const id = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { dialogRef, titleRef, requestClose } = useDialog({
    ...behavior,
    initialFocusRef:
      behavior.initialFocusRef ?? (hideTitle ? closeRef : undefined),
  });
  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${presentation === "fullscreen" ? styles.fullscreen : ""} ${className}`}
      aria-labelledby={`${id}-title`}
      aria-describedby={description?.trim() ? `${id}-description` : undefined}
    >
      <div className={styles.header}>
        <h2
          id={`${id}-title`}
          ref={titleRef}
          tabIndex={-1}
          className={`${styles.title} ${hideTitle ? styles.hiddenTitle : ""}`}
        >
          {title}
        </h2>
        <HexButton
          ref={closeRef}
          icon="close"
          variant="secondary"
          size="small"
          aria-label="Close"
          onClick={requestClose}
        />
      </div>
      <div className={styles.content}>
        {description?.trim() && <p id={`${id}-description`}>{description}</p>}
        {children}
      </div>
    </dialog>
  );
}
