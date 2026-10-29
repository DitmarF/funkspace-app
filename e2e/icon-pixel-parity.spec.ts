import { expect, test } from "@playwright/test";
import {
  compareIconPixels,
  type IconPixels,
} from "./helpers/icon-pixel-parity";

test("icon pixel comparison allows bounded rounding but rejects meaningful changes", () => {
  const original: IconPixels = {
    width: 48,
    height: 48,
    rgba: Array.from({ length: 48 * 48 * 4 }, (_, i) =>
      i % 4 === 3 ? 255 : 100,
    ),
  };
  const copy = () => ({ ...original, rgba: [...original.rgba] });
  const rounding = copy();
  for (let i = 0; i < 13; i++) rounding.rgba[i * 4] += 1;
  rounding.rgba[0] += 6;
  expect(compareIconPixels(original, rounding).matches).toBe(true);
  const tooLargeDelta = copy();
  tooLargeDelta.rgba[0] += 9;
  expect(compareIconPixels(original, tooLargeDelta).matches).toBe(false);
  const tooManyPixels = copy();
  for (let i = 0; i < 17; i++) tooManyPixels.rgba[i * 4] += 1;
  expect(compareIconPixels(original, tooManyPixels).matches).toBe(false);
  const wrongColor = copy();
  for (let i = 0; i < wrongColor.rgba.length; i += 4) wrongColor.rgba[i] = 255;
  expect(compareIconPixels(original, wrongColor).matches).toBe(false);
  const changedShape = copy();
  for (let y = 10; y < 18; y++)
    for (let x = 10; x < 18; x++) changedShape.rgba[(y * 48 + x) * 4] = 0;
  expect(compareIconPixels(original, changedShape).matches).toBe(false);
  const changedAlpha = copy();
  changedAlpha.rgba[3] = 254;
  expect(compareIconPixels(original, changedAlpha).matches).toBe(false);
  expect(compareIconPixels(original, { ...copy(), width: 36 }).matches).toBe(
    false,
  );
});
