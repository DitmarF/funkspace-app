import StyleDictionary from "style-dictionary";
import type { Config, TransformedToken } from "style-dictionary";

const getTokensByMode = (tokens: TransformedToken[], mode: string) =>
  tokens.filter((token) => token.path[token.path.length - 1] === mode);

const TOKEN_MODES = new Set(["default", "dark", "muted", "dark-high-contrast"]);

const toCssVariableReference = (value: unknown) => {
  if (typeof value !== "string") return undefined;

  const match = value.match(/^\{([^}]+)\}$/);
  if (!match) return undefined;

  const path = match[1].split(".");
  const lastSegment = path[path.length - 1];
  const tokenName = TOKEN_MODES.has(lastSegment)
    ? path[path.length - 2]
    : lastSegment;

  return tokenName ? `var(--fs-${tokenName})` : undefined;
};

const buildThemeBlock = (selector: string, tokens: TransformedToken[]) => {
  const lines = tokens.map((token) => {
    const baseName = token.path[token.path.length - 2];
    const originalValue = token.original?.$value ?? token.original?.value;
    // Preserve aliases as CSS-variable references; keep existing literal output stable.
    const value =
      toCssVariableReference(originalValue) ??
      (token.value !== undefined ? token.value : originalValue);
    return `  --fs-${baseName}: ${value};`;
  });

  const body = lines.join("\n");
  const content = body ? `\n${body}\n` : "\n";

  return `${selector} {${content}}\n\n`;
};

StyleDictionary.registerFormat({
  name: "css/variablesByTheme",
  format: ({ dictionary }) => {
    const defaultTokens = getTokensByMode(dictionary.allTokens, "default");
    const darkTokens = getTokensByMode(dictionary.allTokens, "dark");
    const mutedTokens = getTokensByMode(dictionary.allTokens, "muted");
    const highContrastTokens = getTokensByMode(
      dictionary.allTokens,
      "dark-high-contrast",
    );

    let output = buildThemeBlock(":root", defaultTokens);
    output += buildThemeBlock('[data-theme="dark"]', darkTokens);
    output += buildThemeBlock('[data-theme="muted"]', mutedTokens);
    output += buildThemeBlock(
      '[data-theme="dark-high-contrast"]',
      highContrastTokens,
    );

    return output.trimEnd();
  },
});

const config: Config = {
  source: [
    "tokens/fs.tokens.json",
    "tokens/fs.motion.tokens.json",
    "tokens/fs.game.tokens.json",
  ],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "styles/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variablesByTheme",
        },
      ],
    },
  },
};

export default config;
