import { afterEach, expect, it, vi } from "vitest";
import { DOMAdapter } from "./DOMAdapter";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("keeps DOM access guarded outside a browser", () => {
  vi.stubGlobal("window", undefined);
  vi.stubGlobal("document", undefined);
  const dom = new DOMAdapter();
  expect(dom.hasMatchMedia()).toBe(false);
  expect(dom.matchMedia("test")).toBeNull();
  expect(dom.querySelector("html")).toBeNull();
  expect(() => dom.getDocumentElement()).toThrow("Document is not available");
});

it("queries either the document or a supplied root", () => {
  const dom = new DOMAdapter();
  expect(dom.getDocumentElement()).toBe(document.documentElement);
  expect(dom.querySelector("body")).toBe(document.body);
  const root = document.createElement("div");
  root.innerHTML = "<span></span>";
  expect(dom.querySelector("span", root)).toBe(root.firstChild);
});
