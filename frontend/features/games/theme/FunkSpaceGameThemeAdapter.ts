import { colors } from "@funkspace/common/tokens/colors";
import type {
  ThemeService,
  ThemeState,
} from "@/application/theme/ThemeService";
import type { ResolvedTheme } from "@/domain/theme/Theme";
import type { GameTheme, GameThemeSubscriber } from "./GameTheme";

type FunkSpaceThemeSource = Pick<ThemeService, "getCurrentTheme" | "subscribe">;

/**
 * Portfolio-owned bridge from FunkSpace themes to the game integration
 * contract. Generated TypeScript tokens provide resolved color values, so no
 * game consumer needs access to CSS variables or the document.
 */
export class FunkSpaceGameThemeAdapter {
  constructor(private readonly themeSource: FunkSpaceThemeSource) {}

  getCurrentTheme(): GameTheme {
    return this.toGameTheme(this.themeSource.getCurrentTheme());
  }

  subscribe(callback: GameThemeSubscriber): () => void {
    return this.themeSource.subscribe(({ resolvedTheme }: ThemeState) => {
      callback(this.toGameTheme(resolvedTheme));
    });
  }

  toGameTheme(theme: ResolvedTheme): GameTheme {
    const gameColors = colors[theme].game;

    return Object.freeze({
      colors: Object.freeze({
        background: gameColors.background,
        player: gameColors.player,
        enemy: gameColors.enemy,
        projectile: gameColors.projectile,
        effect: gameColors.effect,
      }),
    });
  }
}
