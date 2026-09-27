import type {
  DialogBindingFactory,
  DialogCloseReason,
  DialogCloseDisposition,
  DialogScrollLock,
} from "@/domain/ports/DialogBindingPort";

/** Only the properties written here belong to this lock. */
function lockScroll(
  doc: Document,
  strategy: DialogScrollLock,
): (restore: boolean) => void {
  const win = doc.defaultView;
  if (!win) throw new Error("Dialog requires an active document");
  const { scrollX: x, scrollY: y } = win;
  const gutter = Math.max(0, win.innerWidth - doc.documentElement.clientWidth);
  const padding = parseFloat(win.getComputedStyle(doc.body).paddingRight) || 0;
  const writes: Array<{
    style: CSSStyleDeclaration;
    name: string;
    before: string;
    priority: string;
    owned: string;
    ownedPriority: string;
  }> = [];
  const set = (style: CSSStyleDeclaration, name: string, value: string) => {
    const before = style.getPropertyValue(name);
    const priority = style.getPropertyPriority(name);
    style.setProperty(name, value, "important");
    writes.push({
      style,
      name,
      before,
      priority,
      owned: style.getPropertyValue(name),
      ownedPriority: style.getPropertyPriority(name),
    });
  };
  set(doc.documentElement.style, "overflow", "hidden");
  let stopTracking = () => {};
  if (strategy === "fixed-body") {
    set(doc.body.style, "position", "fixed");
    set(doc.body.style, "top", `${-y}px`);
    set(doc.body.style, "left", `${-x}px`);
    set(doc.body.style, "width", "100%");
  } else {
    // Keep real document coordinates available to native history/fragment scrolling.
    set(doc.body.style, "overflow", "hidden");
    // Anchor coordinates are calculated before the browser's scroll adjustment.
    // Expose the current offset so portfolio CSS can clamp offscreen anchors.
    set(doc.documentElement.style, "--dialog-page-scroll-y", `${y}px`);
    const offset = writes[writes.length - 1];
    const updateOffset = () => {
      if (
        offset.style.getPropertyValue(offset.name) !== offset.owned ||
        offset.style.getPropertyPriority(offset.name) !== offset.ownedPriority
      )
        return;
      offset.style.setProperty(offset.name, `${win.scrollY}px`, "important");
      offset.owned = offset.style.getPropertyValue(offset.name);
    };
    win.addEventListener("resize", updateOffset);
    stopTracking = () => win.removeEventListener("resize", updateOffset);
  }
  if (gutter) set(doc.body.style, "padding-right", `${padding + gutter}px`);
  let released = false;
  return (restore) => {
    if (released) return;
    released = true;
    stopTracking();
    for (const {
      style,
      name,
      before,
      priority,
      owned,
      ownedPriority,
    } of writes.reverse()) {
      if (
        style.getPropertyValue(name) !== owned ||
        style.getPropertyPriority(name) !== ownedPriority
      ) {
        if (process.env.NODE_ENV !== "production")
          console.warn(`[Dialog] Preserving externally changed ${name}`);
        continue;
      }
      if (before) style.setProperty(name, before, priority);
      else style.removeProperty(name);
    }
    if (restore) win.scrollTo({ left: x, top: y, behavior: "instant" });
  };
}

export const bindNativeDialog: DialogBindingFactory<
  HTMLDialogElement,
  HTMLElement
> = (dialog, options) => {
  const doc = dialog.ownerDocument;
  let active = false;
  let destroyed = false;
  let requested = false;
  let waitingForFalse = false;
  let opener: HTMLElement | null = null;
  let releaseScroll: ((restore: boolean) => void) | undefined;

  const focus = (
    target: HTMLElement | null,
    inside: boolean,
    invoker = false,
  ) => {
    if (
      !target ||
      target.ownerDocument !== doc ||
      !target.isConnected ||
      target === doc.body ||
      target === doc.documentElement ||
      dialog.contains(target) !== inside ||
      target.matches(":disabled") ||
      target.closest("[inert], [hidden]") ||
      !target.getClientRects().length ||
      doc.defaultView?.getComputedStyle(target).visibility !== "visible"
    )
      return false;
    // Portfolio's responsive launcher can move above the viewport on resize.
    // Keep legacy explicit-return behavior for other shared consumers.
    const win = doc.defaultView;
    if (
      invoker &&
      options.scrollLock === "document-overflow" &&
      win &&
      !Array.from(target.getClientRects()).some(
        (rect) =>
          rect.bottom > 0 &&
          rect.right > 0 &&
          rect.top < win.innerHeight &&
          rect.left < win.innerWidth,
      )
    )
      return false;
    if (doc.activeElement !== target) target.focus({ preventScroll: true });
    return doc.activeElement === target;
  };

  const finish = (
    mode: DialogCloseDisposition = options.closeDisposition?.() ?? "dismiss",
  ) => {
    if (!active) return;
    // Mark inactive before close(): its later event is an acknowledgment.
    active = false;
    try {
      if (dialog.open) dialog.close();
    } finally {
      const release = releaseScroll;
      releaseScroll = undefined;
      release?.(mode === "dismiss");
      const restored =
        mode === "navigation" ||
        focus(options.returnFocus(), false, true) ||
        focus(opener, false, true) ||
        focus(options.fallbackFocus(), false);
      opener = null;
      if (!restored && process.env.NODE_ENV !== "production")
        console.warn(
          "[Dialog] Provide a mounted, focusable fallback outside the dialog",
        );
      options.onReleased?.(mode);
    }
  };

  const request = (reason: DialogCloseReason) => {
    if (destroyed || requested) return;
    requested = true;
    options.onCloseRequest(reason);
  };
  const cancel = (event: Event) => {
    event.preventDefault();
    if (active) request("cancel");
  };
  const closed = () => {
    // Queued close events have no cycle ID. An open node is a newer cycle;
    // an inactive binding has already cleaned up. Neither may be dismissed.
    if (destroyed || dialog.open || !active) return;
    waitingForFalse = true;
    finish();
    request("native-close");
  };
  dialog.addEventListener("cancel", cancel);
  dialog.addEventListener("close", closed);

  return {
    sync(open) {
      if (destroyed) return;
      if (!open) {
        finish();
        waitingForFalse = false;
        requested = false;
        return;
      }
      if (waitingForFalse) return;
      if (active) {
        if (!dialog.open) closed();
        return;
      }
      if (
        !dialog.isConnected ||
        dialog.open ||
        doc.querySelector("dialog:modal")
      )
        throw new Error(
          "Dialog requires a connected closed node and no other modal",
        );
      const elementType = doc.defaultView?.HTMLElement;
      opener =
        elementType && doc.activeElement instanceof elementType
          ? doc.activeElement
          : null;
      releaseScroll = lockScroll(doc, options.scrollLock ?? "fixed-body");
      try {
        dialog.showModal();
        active = true;
        if (!focus(options.initialFocus(), true))
          focus(options.defaultFocus(), true);
      } catch (error) {
        if (active) {
          // Failed opening is rollback, not a successful navigation release.
          active = false;
          if (dialog.open) dialog.close();
        }
        releaseScroll?.(true);
        releaseScroll = undefined;
        opener = null;
        throw error;
      }
    },
    requestClose() {
      if (active) request("close-button");
    },
    destroy(disposition) {
      if (destroyed) return;
      destroyed = true;
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("close", closed);
      finish(disposition);
    },
  };
};
