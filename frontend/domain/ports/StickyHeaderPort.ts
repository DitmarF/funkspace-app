/** A shell owns only its binding, never the shared motion policy. */
export type StickyHeaderFactory<Target> = (root: Target) => {
  release(): void;
};
