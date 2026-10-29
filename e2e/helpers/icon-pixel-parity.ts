import type { Page } from "@playwright/test";

export type IconPixels = {
  width: number;
  height: number;
  rgba: number[];
};

// Browser rasterization can round a few edge pixels differently for <use>.
// Keep this limit narrowly above the largest retained CI discrepancy.
const MAX_RGB_DELTA = 8;
const MAX_CHANGED_PIXEL_FRACTION = 0.007;

export function compareIconPixels(first: IconPixels, second: IconPixels) {
  const { width, height } = first;
  const sameDimensions =
    width > 0 &&
    height > 0 &&
    width === second.width &&
    height === second.height &&
    first.rgba.length === width * height * 4 &&
    second.rgba.length === width * height * 4;
  if (!sameDimensions)
    return {
      sameDimensions: false,
      alphaMatches: false,
      maxRgbDelta: 0,
      changedPixels: 0,
      allowedPixels: 0,
      matches: false,
    };

  let alphaMatches = true;
  let changedPixels = 0;
  let maxRgbDelta = 0;
  for (let offset = 0; offset < first.rgba.length; offset += 4) {
    let pixelDelta = 0;
    for (let channel = 0; channel < 3; channel++) {
      pixelDelta = Math.max(
        pixelDelta,
        Math.abs(first.rgba[offset + channel] - second.rgba[offset + channel]),
      );
    }
    if (pixelDelta > 0) changedPixels++;
    maxRgbDelta = Math.max(maxRgbDelta, pixelDelta);
    if (first.rgba[offset + 3] !== second.rgba[offset + 3])
      alphaMatches = false;
  }
  const allowedPixels = Math.max(
    1,
    Math.floor(width * height * MAX_CHANGED_PIXEL_FRACTION),
  );
  return {
    sameDimensions,
    alphaMatches,
    maxRgbDelta,
    changedPixels,
    allowedPixels,
    matches:
      alphaMatches &&
      maxRgbDelta <= MAX_RGB_DELTA &&
      changedPixels <= allowedPixels,
  };
}

export async function decodeIconScreenshots(
  page: Page,
  first: Buffer,
  second: Buffer,
): Promise<[IconPixels, IconPixels]> {
  return page.evaluate(
    async ([first64, second64]) => {
      async function decode(base64: string) {
        const binary = atob(base64);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        const bitmap = await createImageBitmap(
          new Blob([bytes], { type: "image/png" }),
        );
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Unable to decode icon screenshots");
        context.drawImage(bitmap, 0, 0);
        const image = context.getImageData(0, 0, canvas.width, canvas.height);
        bitmap.close();
        return {
          width: canvas.width,
          height: canvas.height,
          rgba: Array.from(image.data),
        };
      }
      return [await decode(first64), await decode(second64)];
    },
    [first.toString("base64"), second.toString("base64")],
  );
}
