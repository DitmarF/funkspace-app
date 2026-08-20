/**
 * Renderer-neutral color values supplied by a game host.
 *
 * The game knows only resolved values. It does not depend on portfolio theme
 * names, CSS variables, DOM theme attributes, or frontend services.
 */
export interface GameTheme {
  readonly colors: {
    readonly background: string;
    readonly player: string;
    readonly enemy: string;
    readonly projectile: string;
    readonly effect: string;
  };
}
