/**
 * DOM port interface
 * Abstraction for DOM manipulation operations
 */

export interface DOMPort {
  /**
   * Get the document element
   */
  getDocumentElement(): HTMLElement;

  /**
   * Query selector
   */
  querySelector<T extends Element = Element>(
    selector: string,
    root?: Element,
  ): T | null;

  /**
   * Check if matchMedia is available
   */
  hasMatchMedia(): boolean;

  /**
   * Create a media query list
   */
  matchMedia(query: string): MediaQueryList | null;
}
