import StyleDictionary from "style-dictionary";

const getTokensByMode = (tokens, mode) =>
  tokens.filter((token) => token.path[token.path.length - 1] === mode);

const TOKEN_MODES = new Set(["default", "dark", "muted", "dark-high-contrast"]);

const toCssVariableReference = (value) => {
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

const CATEGORY_METADATA = {
  "fs-colors/FS-Primitive-Colors": {
    label: "Colors/Primitives",
    presenter: "Color",
  },
  "fs-colors/FS-Primitive-Colors-extended": {
    label: "Colors/Extended",
    presenter: "Color",
  },
  "fs-colors/FS-Semantic-Colors/Surface": {
    label: "Colors/Surface",
    presenter: "Color",
  },
  "fs-colors/FS-Semantic-Colors/Content": {
    label: "Colors/Content",
    presenter: "Color",
  },
  "fs-colors/FS-Semantic-Colors/Action": {
    label: "Colors/Actions",
    presenter: "Color",
  },
  "fs-colors/FS-Semantic-Colors/Feedback": {
    label: "Colors/Feedback",
    presenter: "Color",
  },
  "fs-colors/FS-Semantic-Colors/Borders": {
    label: "Borders",
    presenter: "Border",
  },
  "fs-game/Game-Colors": {
    label: "Game/Colors",
    presenter: "Color",
  },
  "fs-spacing/Spacing": {
    label: "Spacing Scale",
    presenter: "Spacing",
  },
  "fs-typography/FontFamilies": {
    label: "Typography/Families",
    presenter: "FontFamily",
  },
  "fs-typography/FontSizes": {
    label: "Typography/Sizes",
    presenter: "FontSize",
  },
  "fs-typography/FontWeights": {
    label: "Typography/Weights",
    presenter: "FontWeight",
  },
  "fs-typography/LineHeights": {
    label: "Typography/Line Heights",
    presenter: "LineHeight",
  },
  "fs-motion/Durations": {
    label: "Motion/Durations",
    presenter: "Duration",
  },
  "fs-motion/Easings": {
    label: "Motion/Easings",
    presenter: "CubicBezier",
  },
};

const buildThemeBlock = (selector, tokens) => {
  const lines = tokens.map((token) => {
    const baseName = token.path[token.path.length - 2];
    const originalValue = token.original?.$value ?? token.original?.value;
    // Preserve aliases as CSS-variable references; keep existing literal output stable.
    const value =
      toCssVariableReference(originalValue) ??
      (token.value !== undefined ? token.value : originalValue);
    const groupKey = token.path.slice(0, token.path.length - 2).join("/");

    return {
      baseName,
      value,
      groupKey,
    };
  });

  const seenGroups = new Set();
  const outputLines = [];

  lines.forEach(({ baseName, value, groupKey }) => {
    if (!seenGroups.has(groupKey)) {
      const meta = CATEGORY_METADATA[groupKey];
      if (meta) {
        outputLines.push(`  /* @tokens ${meta.label} */`);
        if (meta.presenter) {
          outputLines.push(`  /* @presenter ${meta.presenter} */`);
        }
      }
      seenGroups.add(groupKey);
    }

    outputLines.push(`  --fs-${baseName}: ${value};`);
  });

  const body = outputLines.join("\n");
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
