// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { origin, fakeConfiguration } from "../../../tests/contact/fixtures";
import {
  readAllowedContactOrigins,
  readContactConfiguration,
  type ContactEnvironment,
} from "./ContactConfiguration";

const environment: ContactEnvironment = {
  CONTACT_ENABLED: "true",
  CONTACT_ALLOWED_ORIGINS: JSON.stringify([origin]),
  RESEND_API_KEY: fakeConfiguration.apiKey,
  CONTACT_FROM: fakeConfiguration.from,
  CONTACT_TO: fakeConfiguration.to,
};

describe("server-only contact configuration", () => {
  it("uses exact canonical origins and deduplicates them", () => {
    expect(
      readAllowedContactOrigins(
        JSON.stringify([
          origin,
          origin,
          "http://localhost:3000",
          "http://127.0.0.1:3000",
          "http://[::1]:3000",
        ]),
      ),
    ).toEqual([
      origin,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://[::1]:3000",
    ]);
    expect(readContactConfiguration(environment)).toEqual({
      allowedOrigins: [origin],
      delivery: fakeConfiguration,
    });
  });

  it.each([
    undefined,
    "",
    "{}",
    "[]",
    "null",
    "not JSON",
    JSON.stringify([origin, 1]),
    JSON.stringify([origin, "https://*.example.test"]),
    JSON.stringify([origin + "/"]),
    JSON.stringify(["http://public.example.test"]),
    JSON.stringify(["https://u:p@example.test"]),
    JSON.stringify(["https://example.test/path"]),
    JSON.stringify(["https://example.test?query"]),
    JSON.stringify(["https://example.test#fragment"]),
    JSON.stringify(["https://example.test:443"]),
  ])("fails closed for invalid origins %j", (CONTACT_ALLOWED_ORIGINS) => {
    expect(
      readContactConfiguration({ ...environment, CONTACT_ALLOWED_ORIGINS })
        .delivery,
    ).toBeNull();
    expect(readAllowedContactOrigins(CONTACT_ALLOWED_ORIGINS)).toEqual([]);
  });

  it("never reads credential or sender/recipient getters when off or origins invalid", () => {
    const sensitive = vi.fn(() => {
      throw new Error("Must not read");
    });
    for (const controls of [
      {
        CONTACT_ENABLED: "false",
        CONTACT_ALLOWED_ORIGINS: environment.CONTACT_ALLOWED_ORIGINS,
      },
      { CONTACT_ENABLED: "true", CONTACT_ALLOWED_ORIGINS: "[]" },
    ]) {
      expect(
        readContactConfiguration({
          ...controls,
          get RESEND_API_KEY() {
            return sensitive();
          },
          get CONTACT_FROM() {
            return sensitive();
          },
          get CONTACT_TO() {
            return sensitive();
          },
        }).delivery,
      ).toBeNull();
    }
    expect(sensitive).not.toHaveBeenCalled();
  });

  it.each([undefined, "TRUE", "1", " true", "true "])(
    "enables only exact true, not %j",
    (CONTACT_ENABLED) => {
      expect(
        readContactConfiguration({ ...environment, CONTACT_ENABLED }).delivery,
      ).toBeNull();
    },
  );

  it.each([
    { RESEND_API_KEY: undefined },
    { RESEND_API_KEY: fakeConfiguration.apiKey + "\n" },
    { RESEND_API_KEY: "re_" },
    { RESEND_API_KEY: "re_bad\r\nheader" },
    { CONTACT_FROM: undefined },
    { CONTACT_FROM: fakeConfiguration.from + "\n" },
    { CONTACT_FROM: "Visitor <visitor@example.test>" },
    {
      CONTACT_FROM:
        "FunkSpace <contact@example.test>\r\nBcc:other@example.test",
    },
    { CONTACT_FROM: "FunkSpace <contact@example.test,other@example.test>" },
    { CONTACT_TO: undefined },
    { CONTACT_TO: "one@example.test,two@example.test" },
    { CONTACT_TO: " to@example.test " },
    { CONTACT_TO: "bad" },
  ])("rejects missing/invalid mail configuration %j", (invalid) => {
    expect(
      readContactConfiguration({ ...environment, ...invalid }).delivery,
    ).toBeNull();
  });
});
