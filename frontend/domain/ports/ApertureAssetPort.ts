/** Repository-owned silhouette metadata; never an upload or arbitrary URL. */
export type ApertureAsset = Readonly<{
  src: string;
  viewBox: string;
}>;
/** A release cancels work and prevents further callbacks. No persistent service. */
export interface ApertureAssets {
  load(asset: ApertureAsset, result: (href: string | null) => void): () => void;
  checkMask(result: (supported: boolean) => void): () => void;
}
