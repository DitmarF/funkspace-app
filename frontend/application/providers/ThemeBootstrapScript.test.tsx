import { expect, it } from "vitest";
import { ThemeBootstrapScript } from "./ThemeBootstrapScript";
import { themeBootstrapScript } from "../../generated/theme-bootstrap";

it("renders trusted generated data as a parser-executed inline script", () => {
  const script = ThemeBootstrapScript();
  expect(script.type).toBe("script");
  expect(script.props).toEqual({
    id: "theme-script",
    dangerouslySetInnerHTML: { __html: themeBootstrapScript },
  });
});
