export const iconNames = [
  "home",
  "about",
  "contact",
  "animations",
  "games",
  "s-web",
  "github",
  "linkedin",
  "play",
  "pause",
  "stop",
  "replay",
  "privacy",
  "privacy-policy",
  "legal-notice",

  "arrow-down-small",
  "arrow-up-small",
  "arrow-right-small",
  "arrow-left-small",
  "navigation",
  "chat-bot",
  "a11y",
  "languages",
  "arrow-down",
  "arrow-up",
  "arrow-right",
  "arrow-left",
  "settings-burger",
  "playground",
  "more",
  "close",
] as const;
export type IconName = (typeof iconNames)[number];
export type IconSize = 24 | 36 | 48;

// Figma's Close names describe display sizes; retain their actual export frames.
export const closeViewBoxSize = { 24: 26, 36: 40, 48: 48 } as const;

export const spriteIconNames = [
  "home",
  "about",
  "contact",
  "animations",
  "games",
  "s-web",
  "github",
  "linkedin",
  "privacy",
  "privacy-policy",
  "legal-notice",
] as const;
export type SpriteIconName = (typeof spriteIconNames)[number];
export function isSpriteIcon(name: IconName): name is SpriteIconName {
  return spriteIconNames.some((candidate) => candidate === name);
}
