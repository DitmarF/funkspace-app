import StyleDictionary from "style-dictionary";

const getTokensByMode = (tokens, mode) =>
  tokens.filter((token) => token.path[token.path.length - 1] === mode);

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
};

const buildThemeBlock = (selector, tokens) => {
  const lines = tokens.map((token) => {
    const baseName = token.path[token.path.length - 2];
    // Use transformed value, fallback to original value if not transformed
    const value =
      token.value !== undefined ? token.value : token.original?.$value;
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
  source: ["tokens/fs.tokens.json", "tokens/fs.motion.tokens.json"],
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
