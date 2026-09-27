"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import type {
  DialogBinding,
  DialogCloseReason,
  DialogCloseDisposition,
  DialogScrollLock,
} from "@/domain/ports/DialogBindingPort";

export interface DialogBehavior {
  open: boolean;
  closeDispositionRef?: RefObject<DialogCloseDisposition>;
  scrollLock?: DialogScrollLock;
  unmountDisposition?: DialogCloseDisposition;
  onReleased?(disposition: DialogCloseDisposition): void;
  onOpenError?(error: unknown): void;
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
      closeDisposition: () =>
        latest.current.closeDispositionRef?.current ?? "dismiss",
      scrollLock: latest.current.scrollLock,
      onReleased: (mode) => latest.current.onReleased?.(mode),
      onCloseRequest: (reason) => latest.current.onCloseRequest(reason),
      initialFocus: () => latest.current.initialFocusRef?.current ?? null,
      defaultFocus: () => titleRef.current,
      returnFocus: () => latest.current.returnFocusRef?.current ?? null,
      fallbackFocus: () => latest.current.fallbackFocusRef.current,
    });
    binding.current = instance;
    return () => {
      instance.destroy(latest.current.unmountDisposition);
      binding.current = null;
    };
  }, [bindDialog]);
  useLayoutEffect(() => {
    try {
      binding.current?.sync(props.open);
    } catch (error) {
      if (!latest.current.onOpenError) throw error;
      latest.current.onOpenError(error);
    }
  });
  return {
    dialogRef,
    titleRef,
    requestClose: () => binding.current?.requestClose(),
  };
}
