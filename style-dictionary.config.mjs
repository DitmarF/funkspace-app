import StyleDictionary from "style-dictionary";

const getTokensByMode = (tokens, mode) =>
  tokens.filter((token) => token.path[token.path.length - 1] === mode);

const buildThemeBlock = (selector, tokens) => {
  const lines = tokens.map((token) => {
    const baseName = token.path[token.path.length - 2];
    // Use transformed value, fallback to original value if not transformed
    const value = token.value !== undefined ? token.value : token.original?.$value;
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

const config = {
  source: ["tokens/fs.tokens.json"],
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

