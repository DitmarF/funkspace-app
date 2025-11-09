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
    return (
      typeof window !== "undefined" && typeof window.matchMedia === "function"
    );
  }

  matchMedia(query: string): MediaQueryList | null {
    if (!this.hasMatchMedia()) {
      return null;
    }
    return window.matchMedia(query);
  }
}
