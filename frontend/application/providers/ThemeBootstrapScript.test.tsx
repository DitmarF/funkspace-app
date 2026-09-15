import { expect, it, vi } from "vitest";
import { ThemeBootstrapScript } from "./ThemeBootstrapScript";
import { themeBootstrapScript } from "../../generated/theme-bootstrap";

vi.mock("next/script", () => ({ default: () => null }));

it("renders trusted generated data with the existing delivery contract", () => {
  const script = ThemeBootstrapScript();
  expect(script.props).toEqual({
    id: "theme-script",
    strategy: "beforeInteractive",
    dangerouslySetInnerHTML: { __html: themeBootstrapScript },
  });
});
