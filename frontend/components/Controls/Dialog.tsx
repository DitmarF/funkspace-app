"use client";

import { useId, type ReactNode } from "react";
import { useDialog, type DialogBehavior } from "@/hooks/useDialog";
import HexButton from "./HexButton";
import styles from "./Dialog.module.css";

export interface DialogProps extends DialogBehavior {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function Dialog({
  title,
  description,
  children,
  ...behavior
}: DialogProps) {
  const id = useId();
  const { dialogRef, titleRef, requestClose } = useDialog(behavior);
  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={`${id}-title`}
      aria-describedby={description?.trim() ? `${id}-description` : undefined}
    >
      <div className={styles.header}>
        <h2
          id={`${id}-title`}
          ref={titleRef}
          tabIndex={-1}
          className={styles.title}
        >
          {title}
        </h2>
        <HexButton
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
