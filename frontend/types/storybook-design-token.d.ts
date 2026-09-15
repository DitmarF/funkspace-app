// 4.1.0 advertises dist/doc-blocks.d.ts but omits it from the installed package.
// Declare only the doc-block surface used here, verified against the bundled
// DesignTokenDocBlock.tsx source map. viewType defaults to "table" at runtime.
declare module "storybook-design-token/doc-blocks" {
  import type { ComponentType } from "react";

  export const DesignTokenDocBlock: ComponentType<{
    categoryName: string;
    viewType?: "table" | "card";
  }>;
}
