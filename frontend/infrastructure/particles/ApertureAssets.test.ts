import { afterEach, describe, expect, it, vi } from "vitest";
import { apertureAssets, validateApertureExport } from "./ApertureAssets";
import { technicalDiamond } from "@/data/sceneApertures";
const wrap = (content: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${content}</svg>`;
const circle = '<circle cx="50" cy="50" r="50" fill="#000"/>';
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
describe("trusted export profile", () => {
  it("accepts outlined black geometry and compound counters", () => {
    expect(() =>
      validateApertureExport(
        wrap(
          '<path fill-rule="evenodd" d="M50 0 100 50 50 100 0 50Z M50 35 35 50 50 65 65 50Z"/>',
        ),
        technicalDiamond.viewBox,
      ),
    ).not.toThrow();
  });
  it.each([
    "",
    "<svg>",
    wrap(""),
    wrap("<script>alert(1)</script>"),
    wrap('<circle onload="x()"/>'),
    wrap('<image href="data:image/png;base64,AA"/>'),
    wrap('<use href="#a"/>'),
    wrap("<foreignObject/>"),
    wrap("<animate/>"),
    wrap("<filter/>"),
    wrap('<path style="fill:black" d="M0 0Z"/>'),
    wrap('<path fill="white" d="M0 0Z"/>'),
    wrap('<path filter="url(https://example.org/filter)" d="M0 0Z"/>'),
    wrap("<text>SPACE</text>"),
    wrap('<circle r="Infinity"/>'),
    wrap('<circle r="1e999"/>'),
    wrap('<path d="NaN"/>'),
    wrap('<g opacity="0"/>'),
    wrap("<svg/>"),
    '<!DOCTYPE svg [<!ENTITY x "bad">]>' + wrap(circle),
    wrap('<path xmlns="https://example.org" d="M0 0Z"/>'),
    wrap(circle).replace("0 0 100 100", "0 0 0 100"),
    wrap(circle).replace("0 0 100 100", "0 0 100 200"),
  ])("rejects malformed/forbidden export %#", (source) => {
    expect(() =>
      validateApertureExport(source, technicalDiamond.viewBox),
    ).toThrow();
  });
  it("does not claim syntax proves the silhouette (off-artboard geometry is reviewable, not safe-looking proof)", () => {
    expect(() =>
      validateApertureExport(
        wrap('<circle cx="1000" cy="1000" r="1"/>'),
        technicalDiamond.viewBox,
      ),
    ).not.toThrow();
  });
});
describe("asset loading", () => {
  it("returns exactly validated bytes, with no second URL fetch", async () => {
    const source = wrap(circle);
    const result = vi.fn();
    const fetcher = vi
      .fn()
      .mockResolvedValue({ ok: true, text: async () => source });
    vi.stubGlobal("fetch", fetcher);
    apertureAssets.load(technicalDiamond, result);
    await vi.waitFor(() =>
      expect(result).toHaveBeenCalledWith(
        "data:image/svg+xml," + encodeURIComponent(source),
      ),
    );
    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher.mock.calls[0][1]).toMatchObject({
      credentials: "omit",
      redirect: "error",
    });
  });
  it.each([false, true])(
    "missing/rejected files fall back once (%s)",
    async (ok) => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue({ ok, text: async () => wrap("<script/>") }),
      );
      const result = vi.fn();
      apertureAssets.load(technicalDiamond, result);
      await vi.waitFor(() =>
        expect(result).toHaveBeenCalledExactlyOnceWith(null),
      );
    },
  );
  it("cancels pending text and ignores a stale completion", async () => {
    let resolve!: (text: string) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () =>
          new Promise<string>((r) => {
            resolve = r;
          }),
      }),
    );
    const result = vi.fn();
    const release = apertureAssets.load(technicalDiamond, result);
    await vi.waitFor(() => expect(resolve).toBeDefined());
    release();
    release();
    resolve(wrap(circle));
    await Promise.resolve();
    await Promise.resolve();
    expect(result).not.toHaveBeenCalled();
  });
  it("times out without a retry and blocks arbitrary paths", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn(() => new Promise(() => {}));
    vi.stubGlobal("fetch", fetcher);
    const result = vi.fn();
    apertureAssets.load(technicalDiamond, result);
    await vi.advanceTimersByTimeAsync(5000);
    expect(result).toHaveBeenCalledExactlyOnceWith(null);
    const invalid = vi.fn();
    apertureAssets.load(
      { ...technicalDiamond, src: "https://example.org/x.svg" },
      invalid,
    );
    expect(invalid).toHaveBeenCalledExactlyOnceWith(null);
    expect(fetcher).toHaveBeenCalledOnce();
  });
});
describe("mask pixel probe", () => {
  it("wrong luminance pixels and image errors fail closed", () => {
    const image = imageFake();
    const result = vi.fn();
    const spy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue({
        drawImage: vi.fn(),
        getImageData: () => ({ data: new Uint8ClampedArray(32).fill(255) }),
      } as unknown as CanvasRenderingContext2D);
    apertureAssets.checkMask(result);
    image.onload?.();
    expect(result).toHaveBeenCalledExactlyOnceWith(false);
    result.mockClear();
    apertureAssets.checkMask(result);
    image.onerror?.();
    expect(result).toHaveBeenCalledExactlyOnceWith(false);
    spy.mockRestore();
  });
  function imageFake() {
    const image = {
      onload: null as null | (() => void),
      onerror: null as null | (() => void),
      src: "",
    };
    vi.stubGlobal(
      "Image",
      vi.fn(function () {
        return image;
      }),
    );
    return image;
  }
  it("uses observed black-removes/white-keeps pixels, not just a CSS support string", () => {
    const image = imageFake();
    const result = vi.fn();
    const spy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue({
        drawImage: vi.fn(),
        getImageData: () => ({
          data: new Uint8ClampedArray([
            0, 0, 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255,
          ]),
        }),
      } as unknown as CanvasRenderingContext2D);
    const release = apertureAssets.checkMask(result);
    image.onload?.();
    expect(result).toHaveBeenCalledExactlyOnceWith(true);
    release();
    spy.mockRestore();
  });
  it("unavailable context, wrong pixels, load error and cancellation stay safe", () => {
    const image = imageFake();
    const result = vi.fn();
    const spy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(null);
    apertureAssets.checkMask(result);
    image.onload?.();
    expect(result).toHaveBeenCalledExactlyOnceWith(false);
    result.mockClear();
    const release = apertureAssets.checkMask(result);
    const late = image.onload;
    release();
    late?.();
    expect(result).not.toHaveBeenCalled();
    expect(image.onload).toBeNull();
    spy.mockRestore();
  });
});
