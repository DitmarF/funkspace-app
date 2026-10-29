import type {
  ApertureAsset,
  ApertureAssets,
} from "@/domain/ports/ApertureAssetPort";

const namespace = "http://www.w3.org/2000/svg";
const tags = new Set([
  "svg",
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "polygon",
  "polyline",
]);
const attributes = new Set([
  "xmlns",
  "viewBox",
  "version",
  "fill",
  "fill-rule",
  "d",
  "x",
  "y",
  "width",
  "height",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "points",
  "transform",
]);
const number = /[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:[eE][-+]?\d+)?/g;

/** Strict export profile, not a sanitizer: rejected content is never embedded. */
export function validateApertureExport(
  source: string,
  expectedViewBox: string,
): void {
  if (/<!DOCTYPE|<!ENTITY|<\?(?!xml\s)/i.test(source))
    throw new Error("Forbidden SVG declaration");
  const doc = new DOMParser().parseFromString(source, "image/svg+xml");
  const root = doc.documentElement;
  if (
    doc.querySelector("parsererror") ||
    root.localName !== "svg" ||
    root.namespaceURI !== namespace
  )
    throw new Error("Malformed SVG");
  const box = root
    .getAttribute("viewBox")
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);
  const expected = expectedViewBox
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  if (
    !box ||
    box.length !== 4 ||
    !box.every(Number.isFinite) ||
    box[2] <= 0 ||
    box[3] <= 0 ||
    box.some((n, i) => n !== expected[i]) ||
    expected.length !== 4
  )
    throw new Error("Invalid SVG viewBox");
  let geometry = 0;
  for (const element of [root, ...root.querySelectorAll("*")]) {
    if (
      element.namespaceURI !== namespace ||
      !tags.has(element.localName) ||
      (element !== root && element.localName === "svg")
    )
      throw new Error("Forbidden SVG element");
    if (!["svg", "g"].includes(element.localName)) geometry++;
    for (const attribute of element.attributes) {
      const { name, value } = attribute;
      if (!attributes.has(name) || (attribute.namespaceURI && name !== "xmlns"))
        throw new Error("Forbidden SVG attribute");
      if (name === "xmlns" && (element !== root || value !== namespace))
        throw new Error("Invalid SVG namespace");
      if (name === "fill" && !/^(black|#000|#000000)$/.test(value))
        throw new Error("Aperture must be opaque black");
      if (name === "fill-rule" && !/^(evenodd|nonzero)$/.test(value))
        throw new Error("Invalid fill rule");
      if (
        [
          "d",
          "points",
          "transform",
          "viewBox",
          "x",
          "y",
          "width",
          "height",
          "cx",
          "cy",
          "r",
          "rx",
          "ry",
          "version",
        ].includes(name)
      ) {
        const rest = value.replace(number, "");
        const allowed =
          name === "d"
            ? /^[\s,MmZzLlHhVvCcSsQqTtAa]*$/
            : name === "transform"
              ? /^(?:[\s,()]|matrix|translate|scale|rotate|skewX|skewY)*$/
              : /^[\s,]*$/;
        if (
          !allowed.test(rest) ||
          !(value.match(number) ?? []).every((n) => Number.isFinite(Number(n)))
        )
          throw new Error("Invalid SVG geometry");
      }
    }
  }
  if (!geometry) throw new Error("Empty SVG export");
}

/** Browser-owned, bounded, event-driven checks. No scene clock or frame owner. */
export const apertureAssets: ApertureAssets = {
  load(asset: ApertureAsset, result) {
    const abort = new AbortController();
    let active = true;
    const timer = window.setTimeout(() => {
      abort.abort();
      finish(null);
    }, 5000);
    const finish = (href: string | null) => {
      if (!active) return;
      active = false;
      window.clearTimeout(timer);
      result(href);
    };
    void (async () => {
      try {
        if (!/^\/scene-apertures\/[a-z0-9-]+\.svg$/.test(asset.src))
          throw new Error("Untrusted SVG path");
        const response = await fetch(asset.src, {
          signal: abort.signal,
          credentials: "omit",
          redirect: "error",
        });
        if (!response.ok) throw new Error("Missing SVG");
        const source = await response.text();
        if (!active) return;
        validateApertureExport(source, asset.viewBox);
        // Embed the exact validated bytes; no second URL fetch / validation race.
        finish("data:image/svg+xml," + encodeURIComponent(source));
      } catch {
        finish(null);
      }
    })();
    return () => {
      active = false;
      window.clearTimeout(timer);
      abort.abort();
    };
  },
  checkMask(result) {
    let active = true;
    const image = new Image();
    const finish = (supported: boolean) => {
      if (!active) return;
      active = false;
      window.clearTimeout(timer);
      image.onload = image.onerror = null;
      result(supported);
    };
    const timer = window.setTimeout(() => finish(false), 5000);
    image.onerror = () => finish(false);
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 4;
        canvas.height = 2;
        const context = canvas.getContext("2d");
        if (!context) return finish(false);
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, 4, 2).data;
        finish(
          pixels[3] === 255 &&
            pixels[7] === 0 &&
            pixels[11] === 0 &&
            pixels[15] === 255,
        );
      } catch {
        finish(false);
      }
    };
    image.src =
      "data:image/svg+xml," +
      encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="2"><defs><mask id="test" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="4" height="2" style="mask-type:luminance"><rect width="4" height="2" fill="white"/><rect x="1" width="2" height="2" fill="black"/></mask></defs><rect width="4" height="2" mask="url(#test)"/></svg>',
      );
    return () => {
      active = false;
      window.clearTimeout(timer);
      image.onload = image.onerror = null;
      image.src = "";
    };
  },
};
