import type {
  DialogBindingFactory,
  DialogCloseReason,
} from "@/domain/ports/DialogBindingPort";

/** Only the properties written here belong to this lock. */
function lockScroll(doc: Document): () => void {
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
    });
  };
  set(doc.documentElement.style, "overflow", "hidden");
  set(doc.body.style, "position", "fixed");
  set(doc.body.style, "top", `${-y}px`);
  set(doc.body.style, "left", `${-x}px`);
  set(doc.body.style, "width", "100%");
  if (gutter) set(doc.body.style, "padding-right", `${padding + gutter}px`);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    for (const { style, name, before, priority, owned } of writes.reverse()) {
      if (
        style.getPropertyValue(name) !== owned ||
        style.getPropertyPriority(name) !== "important"
      ) {
        if (process.env.NODE_ENV !== "production")
          console.warn(`[Dialog] Preserving externally changed ${name}`);
        continue;
      }
      if (before) style.setProperty(name, before, priority);
      else style.removeProperty(name);
    }
    win.scrollTo({ left: x, top: y, behavior: "instant" });
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
  let releaseScroll: (() => void) | undefined;

  const focus = (target: HTMLElement | null, inside: boolean) => {
    if (
      !target ||
      target.ownerDocument !== doc ||
      !target.isConnected ||
      target === doc.body ||
      target === doc.documentElement ||
      dialog.contains(target) !== inside ||
      target.matches(":disabled") ||
      target.closest("[inert]") ||
      !target.getClientRects().length ||
      doc.defaultView?.getComputedStyle(target).visibility !== "visible"
    )
      return false;
    if (doc.activeElement !== target) target.focus({ preventScroll: true });
    return doc.activeElement === target;
  };

  const finish = () => {
    if (!active) return;
    // Mark inactive before close(): its later event is an acknowledgment.
    active = false;
    try {
      if (dialog.open) dialog.close();
    } finally {
      releaseScroll?.();
      releaseScroll = undefined;
      const restored =
        focus(options.returnFocus(), false) ||
        focus(opener, false) ||
        focus(options.fallbackFocus(), false);
      opener = null;
      if (!restored && process.env.NODE_ENV !== "production")
        console.warn(
          "[Dialog] Provide a mounted, focusable fallback outside the dialog",
        );
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
      releaseScroll = lockScroll(doc);
      try {
        dialog.showModal();
        active = true;
        if (!focus(options.initialFocus(), true))
          focus(options.defaultFocus(), true);
      } catch (error) {
        if (active) finish();
        else releaseScroll?.();
        releaseScroll = undefined;
        opener = null;
        throw error;
      }
    },
    requestClose() {
      if (active) request("close-button");
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      dialog.removeEventListener("cancel", cancel);
      dialog.removeEventListener("close", closed);
      finish();
    },
  };
};
