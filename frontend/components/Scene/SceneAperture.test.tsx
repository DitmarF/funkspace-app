import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import SceneAperture from "./SceneAperture";
import { FunkSpaceLogoInline } from "../Logo/FunkSpaceLogoInline";
const fake = vi.hoisted(() => ({ checkMask: vi.fn(), load: vi.fn() }));
vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => ({ apertureAssets: fake }),
}));
beforeEach(() => {
  fake.checkMask.mockReset().mockImplementation((ready) => {
    ready(true);
    return vi.fn();
  });
  fake.load.mockReset().mockReturnValue(vi.fn());
});
describe("aperture composition", () => {
  it("renders outlined WEB independently of masking and asset loading", () => {
    const html = renderToString(<SceneAperture selection="web" />);
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    expect(
      wrapper.querySelector("[data-aperture-fallback] path"),
    ).not.toBeNull();
    expect(wrapper.querySelector("text")).toBeNull();
  });
  it("readiness does not depend on a pre-hydration SVG load event", () => {
    const ready = vi.fn();
    render(<SceneAperture onReady={ready} />);
    expect(ready).toHaveBeenLastCalledWith(true);
  });
  it("failed selected-image decoding retains the built-in circle", () => {
    fake.load.mockImplementation((_asset, result) => {
      result("data:image/svg+xml,broken");
      return vi.fn();
    });
    const view = render(<SceneAperture selection="technical-diamond" />);
    const selected = view.container.querySelectorAll("image")[1];
    fireEvent.error(selected);
    fireEvent.load(selected);
    expect(
      view.container.querySelector("[data-scene-aperture]"),
    ).toHaveAttribute("data-aperture", "circle");
  });
  it("SSR has independent complete artwork; IDs are scoped across cover/thumbnail/logo", () => {
    const html = renderToString(
      <>
        <SceneAperture />
        <SceneAperture selection="technical-diamond" />
        <FunkSpaceLogoInline />
      </>,
    );
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const ids = [...wrapper.querySelectorAll("[id]")].map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(wrapper.querySelectorAll("[data-aperture-fallback]")).toHaveLength(
      2,
    );
    expect(
      wrapper.querySelectorAll(
        "mask[maskUnits='userSpaceOnUse'][maskContentUnits='userSpaceOnUse']",
      ),
    ).toHaveLength(2);
    expect(wrapper.querySelector("mask")?.getAttribute("style")).toContain(
      "mask-type:luminance",
    );
  });
  it("holds circle until validated asset load and ignores stale callbacks after replacement", async () => {
    const callbacks: ((href: string | null) => void)[] = [];
    fake.load.mockImplementation((_asset, cb) => {
      callbacks.push(cb);
      return vi.fn();
    });
    const view = render(<SceneAperture selection="technical-diamond" />);
    fireEvent.load(view.container.querySelector("image")!);
    act(() => callbacks[0]("data:image/svg+xml,first"));
    const images = view.container.querySelectorAll("image");
    expect(
      view.container.querySelector("[data-scene-aperture]"),
    ).toHaveAttribute("data-aperture", "circle");
    fireEvent.load(images[1]);
    expect(
      view.container.querySelector("[data-scene-aperture]"),
    ).toHaveAttribute("data-aperture", "technical-diamond");
    view.rerender(<SceneAperture />);
    act(() => callbacks[0]("data:image/svg+xml,stale"));
    expect(view.container.querySelectorAll("image")).toHaveLength(1);
    view.rerender(<SceneAperture selection="technical-diamond" />);
    await waitFor(() => expect(callbacks).toHaveLength(2));
    act(() => callbacks[0]("data:image/svg+xml,stale-again"));
    expect(view.container.querySelectorAll("image")).toHaveLength(1);
    act(() => callbacks[1](null));
    expect(
      view.container.querySelector("[data-scene-aperture]"),
    ).toHaveAttribute("data-aperture", "circle");
  });
  it("asset decode failure retains circle and mask failure never signals readiness", () => {
    fake.checkMask.mockImplementation((cb) => {
      cb(false);
      return vi.fn();
    });
    const ready = vi.fn();
    const view = render(<SceneAperture onReady={ready} />);
    fireEvent.load(view.container.querySelector("image")!);
    expect(ready).not.toHaveBeenCalledWith(true);
    expect(
      view.container.querySelector("[data-aperture-fallback]"),
    ).toBeInTheDocument();
  });
  it("releases owned checks on unmount", () => {
    const maskRelease = vi.fn(),
      assetRelease = vi.fn();
    fake.checkMask.mockReturnValue(maskRelease);
    fake.load.mockReturnValue(assetRelease);
    const view = render(<SceneAperture selection="technical-diamond" />);
    view.unmount();
    expect(maskRelease).toHaveBeenCalledOnce();
    expect(assetRelease).toHaveBeenCalledOnce();
  });
});
