/** A single accepted portfolio-link intent, not a router or modal manager. */
export interface PortfolioFocusTarget {
  href: string;
  focusId: string;
}
export interface PortfolioNavigationTicket {
  id: number;
  kind: "same-document" | "client-route";
}
export interface PortfolioNavigationHandoffPort<TFocus> {
  begin(target: PortfolioFocusTarget): PortfolioNavigationTicket;
  released(id: number): void;
  arrived(main: TFocus): void;
  cancelPreferred(id?: number): void;
  cancel(id?: number): void;
  fallbackTarget(): TFocus | null;
  /** Notify once, asynchronously, when the native disclosure is closed and
   * focus has left it. Cleanup cancels listeners and queued notification. */
  whenFallbackIdle(disclosure: TFocus, notify: () => void): () => void;
  observeDeparture(
    notify: (cause: "history" | "fragment" | "document") => void,
  ): () => void;
}
