/**
 * Renderer-neutral color contract passed from the portfolio to a game.
 *
 * Games consume resolved color values only. They do not know about FunkSpace
 * theme names, design-token paths, CSS variables, or DOM attributes.
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

export type GameThemeSubscriber = (theme: GameTheme) => void;
