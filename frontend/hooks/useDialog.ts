"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import type {
  DialogBinding,
  DialogCloseReason,
} from "@/domain/ports/DialogBindingPort";

export interface DialogBehavior {
  open: boolean;
  onCloseRequest(reason: DialogCloseReason): void;
  initialFocusRef?: RefObject<HTMLElement | null>;
  returnFocusRef?: RefObject<HTMLElement | null>;
  fallbackFocusRef: RefObject<HTMLElement | null>;
}

export function useDialog(props: DialogBehavior) {
  const { bindDialog } = useServices();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const latest = useRef(props);
  const binding = useRef<DialogBinding | null>(null);
  useLayoutEffect(() => {
    latest.current = props;
  });
  useLayoutEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    const instance = bindDialog(node, {
      onCloseRequest: (reason) => latest.current.onCloseRequest(reason),
      initialFocus: () => latest.current.initialFocusRef?.current ?? null,
      defaultFocus: () => titleRef.current,
      returnFocus: () => latest.current.returnFocusRef?.current ?? null,
      fallbackFocus: () => latest.current.fallbackFocusRef.current,
    });
    binding.current = instance;
    return () => {
      instance.destroy();
      binding.current = null;
    };
  }, [bindDialog]);
  useLayoutEffect(() => {
    binding.current?.sync(props.open);
  });
  return {
    dialogRef,
    titleRef,
    requestClose: () => binding.current?.requestClose(),
  };
}
