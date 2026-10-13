// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { request, submissionId } from "../../../tests/contact/fixtures";
import {
  contactEmailError,
  isProviderAcceptanceId,
  validateContactRequest,
} from "./ContactValidation";

function errors(input: unknown) {
  const result = validateContactRequest(input);
  expect(result.valid).toBe(false);
  if (result.valid) throw new Error("Expected validation failure");
  return result.result;
}

describe("contact pure validation", () => {
  it("normalizes only the approved whitespace, line endings and UUID casing", () => {
    const result = validateContactRequest({
      ...request,
      name: "  Zoë 💎  ",
      email: " Visitor@Example.test ",
      message: "  One\r\nTwo\rThree\tend  ",
      submissionId: submissionId.toUpperCase(),
    });
    expect(result).toEqual({
      valid: true,
      value: {
        ...request,
        name: "Zoë 💎",
        email: "Visitor@Example.test",
        message: "One\nTwo\nThree\tend",
      },
    });
    if (result.valid) expect(Object.isFrozen(result.value)).toBe(true);
  });

  it("allows optional Name and preserves literal HTML as plain text", () => {
    expect(
      validateContactRequest({
        ...request,
        name: " ",
        message: "<b>Literal</b>",
      }).valid,
    ).toBe(true);
  });

  it.each([null, [], "{}", 42, false, undefined])(
    "rejects non-object shape %j",
    (input) => {
      expect(errors(input)).toMatchObject({
        httpStatus: 400,
        body: { code: "invalid_shape", submissionId: null },
      });
    },
  );

  it.each(["name", "email", "message", "submissionId", "website"] as const)(
    "requires exactly string field %s",
    (field) => {
      const missing: Record<string, unknown> = { ...request };
      delete missing[field];
      expect(errors(missing).body).toMatchObject({ code: "invalid_shape" });
      for (const value of [null, 0, true, {}, [], undefined]) {
        expect(errors({ ...request, [field]: value }).body).toMatchObject({
          code: "invalid_shape",
        });
      }
    },
  );

  it("rejects unexpected keys, inherited fields, symbols and getters without executing them", () => {
    expect(errors({ ...request, to: "other@example.test" }).body).toMatchObject(
      { code: "invalid_shape" },
    );
    expect(errors(Object.create(request)).body).toMatchObject({
      code: "invalid_shape",
    });
    expect(errors({ ...request, [Symbol("extra")]: "" }).body).toMatchObject({
      code: "invalid_shape",
    });
    const get = vi.fn(() => request.name);
    const value = { ...request };
    Object.defineProperty(value, "name", { get });
    expect(errors(value).body).toMatchObject({ code: "invalid_shape" });
    expect(get).not.toHaveBeenCalled();
  });

  it.each([
    "",
    submissionId + "\n",
    " " + submissionId,
    submissionId.replace("-4abc", "-1abc"),
    submissionId.replace("-8def", "-7def"),
    "not-a-uuid",
  ])("rejects invalid UUID v4 %s", (submissionId) => {
    expect(errors({ ...request, submissionId }).body).toEqual({
      status: "rejected",
      code: "invalid_submission_id",
      submissionId: null,
    });
  });

  it.each([" ", "\t", "https://bot.example.test"])(
    "does not trim a populated spam trap %j into empty",
    (website) => {
      expect(errors({ ...request, website }).body).toMatchObject({
        code: "spam_rejected",
        submissionId,
      });
    },
  );

  it("counts UTF-16 units after normalization at exact field boundaries", () => {
    expect(
      validateContactRequest({
        ...request,
        name: "💎".repeat(50),
        message: "a".repeat(5000),
      }).valid,
    ).toBe(true);
    expect(
      errors({
        ...request,
        name: "💎".repeat(50) + "a",
        message: "a".repeat(5001),
      }).body,
    ).toMatchObject({
      fieldErrors: { name: "too_long", message: "too_long" },
    });
    expect(
      validateContactRequest({
        ...request,
        name: "  " + "n".repeat(100) + "  ",
        message: "\r\n" + "m".repeat(5000) + "\r",
      }).valid,
    ).toBe(true);
    const tail = "@example.test";
    expect(
      contactEmailError("a".repeat(254 - tail.length) + tail),
    ).toBeUndefined();
    expect(contactEmailError("a".repeat(255 - tail.length) + tail)).toBe(
      "too_long",
    );
  });

  it("collects required errors on visible fields only", () => {
    expect(errors({ ...request, email: " ", message: "\r\n \t" })).toEqual({
      httpStatus: 422,
      body: {
        status: "invalid",
        code: "validation_failed",
        submissionId,
        fieldErrors: { email: "required", message: "required" },
      },
    });
  });

  it.each([
    "a@example.test,b@example.test",
    "Visitor <a@example.test>",
    '"a"@example.test',
    "a@-bad.test",
    "a@例.test",
    "a b@example.test",
  ])("rejects non-practical single address %s", (email) => {
    expect(errors({ ...request, email }).body).toMatchObject({
      fieldErrors: { email: "invalid_email" },
    });
  });

  it.each(["a+tag@xn--bcher-kva.test", "a@localhost", "a.b+tag@example.test"])(
    "accepts HTML-compatible address %s",
    (email) => {
      expect(validateContactRequest({ ...request, email }).valid).toBe(true);
    },
  );

  it.each([
    "\r\nBcc: other@example.test",
    "\n",
    "\t",
    "\0",
    "\u0085",
    "\u2028",
    "\ud800",
    "\udc00",
  ])(
    "rejects raw header controls/surrogates %j before trimming",
    (injection) => {
      expect(
        errors({
          ...request,
          name: injection + "x",
          email: request.email + injection,
        }).body,
      ).toMatchObject({
        fieldErrors: {
          name: "invalid_characters",
          email: "invalid_characters",
        },
      });
    },
  );

  it.each(["\0", "\u000b", "\u007f", "\u0085", "\ud800", "\udc00"])(
    "rejects forbidden Message characters %j",
    (message) => {
      expect(errors({ ...request, message }).body).toMatchObject({
        fieldErrors: { message: "invalid_characters" },
      });
    },
  );

  it("keeps invalid-character precedence over length and required errors", () => {
    expect(
      errors({ ...request, email: "\0" + "x".repeat(300) }).body,
    ).toMatchObject({ fieldErrors: { email: "invalid_characters" } });
  });

  it("requires a real provider UUID, not merely a nonempty ID", () => {
    expect(isProviderAcceptanceId(submissionId)).toBe(true);
    for (const id of [
      "",
      "provider-123",
      "0".repeat(36),
      submissionId + "\n",
      null,
    ])
      expect(isProviderAcceptanceId(id)).toBe(false);
  });
});
