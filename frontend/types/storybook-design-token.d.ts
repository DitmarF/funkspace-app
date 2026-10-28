// Version 5 types require viewType although the runtime defaults it to "table".
// Keep the declaration aligned with the doc-block surface used by these stories.
declare module "storybook-design-token/doc-blocks" {
  import type { ComponentType } from "react";

  export const DesignTokenDocBlock: ComponentType<{
    categoryName: string;
    viewType?: "table" | "card";
  }>;
}
