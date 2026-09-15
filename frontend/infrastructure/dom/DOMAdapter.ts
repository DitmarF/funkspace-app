/**
 * DOM Adapter
 * Infrastructure implementation of DOMPort
 */

import type { DOMPort } from "@/domain/ports/DOMPort";

export class DOMAdapter implements DOMPort {
  getDocumentElement(): HTMLElement {
    if (typeof document === "undefined") {
      throw new Error("Document is not available");
    }
    return document.documentElement;
  }

  querySelector<T extends Element = Element>(
    selector: string,
    root?: Element,
  ): T | null {
    if (typeof document === "undefined") {
      return null;
    }
    const searchRoot = root || document;
    return searchRoot.querySelector<T>(selector);
  }

  hasMatchMedia(): boolean {
    try {
      return (
        typeof window !== "undefined" && typeof window.matchMedia === "function"
      );
    } catch {
      return false;
    }
  }

  matchMedia(query: string): MediaQueryList | null {
    if (!this.hasMatchMedia()) {
      return null;
    }
    try {
      const media = window.matchMedia(query);
      // Access can fail independently of invoking matchMedia (restricted hosts).
      void media.matches;
      return media;
    } catch {
      return null;
    }
  }
}
