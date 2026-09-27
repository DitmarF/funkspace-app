import type {
  PortfolioNavigationHandoffPort,
  PortfolioNavigationTicket,
} from "@/domain/ports/PortfolioNavigationHandoffPort";

type Receipt = PortfolioNavigationTicket & {
  url: URL;
  focusId: string;
  source: number;
  preferred: boolean;
  released: boolean;
  arrival?: { owner: number; href: string };
};

/** Inert at construction; browser work belongs to the live portfolio owner. */
export function createPortfolioNavigationHandoff(
  getDocument: () => Document | undefined = () =>
    typeof document === "undefined" ? undefined : document,
): PortfolioNavigationHandoffPort<HTMLElement> {
  let sequence = 0;
  let ownerSequence = 0;
  const owners = new WeakMap<HTMLElement, number>();
  let pending: Receipt | undefined;
  let cancelFrame: (() => void) | undefined;
  const owner = (main: HTMLElement | null) => {
    if (!main) return 0;
    let id = owners.get(main);
    if (!id) {
      id = ++ownerSequence;
      owners.set(main, id);
    }
    return id;
  };
  const main = () => getDocument()?.getElementById("main-content") ?? null;
  const usable = (node: HTMLElement | null): node is HTMLElement =>
    !!node &&
    node.ownerDocument === getDocument() &&
    node.isConnected &&
    !node.closest("[inert], [hidden], dialog") &&
    !node.matches(":disabled") &&
    !!node.getClientRects().length &&
    node.ownerDocument.defaultView?.getComputedStyle(node).visibility ===
      "visible" &&
    (node.tabIndex >= 0 ||
      node.hasAttribute("tabindex") ||
      node.isContentEditable);
  const fragment = (url: URL) => {
    try {
      return url.hash
        ? (getDocument()?.getElementById(
            decodeURIComponent(url.hash.slice(1)),
          ) ?? null)
        : null;
    } catch {
      return null;
    }
  };
  const clearFrame = () => {
    cancelFrame?.();
    cancelFrame = undefined;
  };
  const cancel = (id?: number) => {
    if (id !== undefined && pending?.id !== id) return;
    clearFrame();
    pending = undefined;
  };
  const cancelPreferred = (id?: number) => {
    if (!pending || (id !== undefined && pending.id !== id)) return;
    if (pending.kind === "same-document" || owner(main()) !== pending.source) {
      cancel(id);
      return;
    }
    clearFrame();
    pending.preferred = false;
  };
  const target = (receipt: Receipt, url: URL) => {
    const hash = fragment(url);
    if (usable(hash)) return hash;
    const preferred =
      receipt.preferred &&
      (receipt.kind === "same-document" || url.href === receipt.url.href)
        ? (getDocument()?.getElementById(receipt.focusId) ?? null)
        : null;
    return usable(preferred) ? preferred : main();
  };
  const focus = (node: HTMLElement | null) => {
    if (!usable(node)) {
      console.warn("[PortfolioNavigation] Missing focusable arrival target");
      return;
    }
    const active = node.ownerDocument.activeElement;
    // Keep a valid native fragment focus or a meaningful descendant.
    if (
      active === node ||
      (active instanceof node.ownerDocument.defaultView!.HTMLElement &&
        node.contains(active) &&
        usable(active))
    )
      return;
    node.focus({ preventScroll: true });
  };
  const schedule = () => {
    const receipt = pending;
    const doc = getDocument();
    const win = doc?.defaultView;
    if (!receipt?.released || !receipt.arrival || !doc || !win) return;
    if (doc.querySelector("dialog:modal")) {
      cancel(receipt.id);
      return;
    }
    clearFrame();
    const frame = win.requestAnimationFrame(() => {
      cancelFrame = undefined;
      if (pending !== receipt) return;
      const url = new URL(win.location.href);
      const valid =
        owner(main()) === receipt.arrival?.owner &&
        (receipt.kind === "same-document"
          ? url.pathname === receipt.url.pathname &&
            url.search === receipt.url.search
          : url.href === receipt.arrival?.href);
      cancel(receipt.id);
      if (!valid || doc.querySelector("dialog:modal")) return;
      focus(
        target(receipt, receipt.kind === "same-document" ? receipt.url : url),
      );
    });
    cancelFrame = () => win.cancelAnimationFrame(frame);
  };
  return {
    begin(destination) {
      cancel();
      const doc = getDocument();
      const win = doc?.defaultView;
      if (!doc || !win)
        throw new Error("Portfolio navigation requires a document");
      const url = new URL(destination.href, win.location.href);
      // Portfolio routes keep the same main/overlay owner when removing a
      // query. Release on activation; only a different path needs mount arrival.
      // Next still owns the query commit, history capture and first scroll.
      const kind =
        url.origin === win.location.origin &&
        url.pathname === win.location.pathname
          ? "same-document"
          : "client-route";
      pending = {
        id: ++sequence,
        kind,
        url,
        focusId: destination.focusId,
        source: owner(main()),
        preferred: true,
        released: false,
      };
      return { id: pending.id, kind };
    },
    released(id) {
      const receipt = pending;
      if (!receipt || receipt.id !== id || receipt.released) return;
      receipt.released = true;
      if (receipt.kind === "same-document") {
        const node = target(receipt, receipt.url);
        if (usable(node)) {
          // A changed hash must let Next capture the departing history position
          // before its first scroll. Repeated hrefs have no commit to rely on.
          if (getDocument()?.defaultView?.location.href === receipt.url.href)
            node.scrollIntoView({ behavior: "instant", block: "start" });
          focus(node);
        }
        receipt.arrival = { owner: owner(main()), href: receipt.url.href };
      }
      schedule();
    },
    arrived(node) {
      const receipt = pending;
      const win = getDocument()?.defaultView;
      if (
        !receipt ||
        !win ||
        node !== main() ||
        !usable(node) ||
        owner(node) === receipt.source
      )
        return;
      receipt.arrival = { owner: owner(node), href: win.location.href };
      schedule();
    },
    cancelPreferred,
    cancel,
    fallbackTarget() {
      const node = main();
      return usable(node) ? node : null;
    },
    observeDeparture(notify) {
      const doc = getDocument();
      const win = doc?.defaultView;
      if (!doc || !win) return () => {};
      const depart = (cause: "history" | "fragment" | "document") => {
        cancel();
        notify(cause);
      };
      const history = () => depart("history");
      const hash = () => depart("fragment");
      const hide = () => depart("document");
      const show = (event: PageTransitionEvent) => {
        if (event.persisted) depart("document");
      };
      const input = () => cancelPreferred();
      win.addEventListener("popstate", history);
      win.addEventListener("hashchange", hash);
      win.addEventListener("pagehide", hide);
      win.addEventListener("pageshow", show);
      doc.addEventListener("pointerdown", input, true);
      doc.addEventListener("keydown", input, true);
      return () => {
        win.removeEventListener("popstate", history);
        win.removeEventListener("hashchange", hash);
        win.removeEventListener("pagehide", hide);
        win.removeEventListener("pageshow", show);
        doc.removeEventListener("pointerdown", input, true);
        doc.removeEventListener("keydown", input, true);
      };
    },
  };
}
