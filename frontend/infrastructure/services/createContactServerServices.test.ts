// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  acceptanceId,
  contactRequest,
  fakeConfiguration,
  origin,
  request,
  submissionId,
} from "../../../tests/contact/fixtures";
import type { ContactFetch } from "@/infrastructure/contact/ResendContactDelivery";
import { createContactServerServices } from "./createContactServerServices";
import { POST, OPTIONS, runtime } from "@/app/api/contact/route";

beforeEach(() => {
  // Override every contact variable with synthetic data; never use host secrets.
  vi.stubEnv("CONTACT_ENABLED", undefined);
  vi.stubEnv("CONTACT_ALLOWED_ORIGINS", JSON.stringify([origin]));
  vi.stubEnv("RESEND_API_KEY", fakeConfiguration.apiKey);
  vi.stubEnv("CONTACT_FROM", fakeConfiguration.from);
  vi.stubEnv("CONTACT_TO", fakeConfiguration.to);
  vi.spyOn(console, "info").mockImplementation(() => {});
});

describe("production contact composition configuration gate", () => {
  it.each([undefined, "false", "TRUE", "1"])(
    "defaults/fails off for CONTACT_ENABLED=%j even with valid synthetic configuration",
    async (enabled) => {
      vi.stubEnv("CONTACT_ENABLED", enabled);
      const services = createContactServerServices();
      expect(services.available).toBe(false);
      const response = await POST(contactRequest());
      expect(runtime).toBe("nodejs");
      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({
        status: "unavailable",
        code: "configuration_unavailable",
        submissionId,
      });
      expect(globalThis.fetch).not.toHaveBeenCalled();
      expect(console.info).toHaveBeenCalledExactlyOnceWith(
        JSON.stringify({
          event: "contact_outcome",
          httpStatus: 503,
          outcome: "unavailable",
          code: "configuration_unavailable",
        }),
      );
    },
  );

  it.each([
    { variable: "RESEND_API_KEY", value: undefined, httpStatus: 503 },
    { variable: "RESEND_API_KEY", value: "invalid", httpStatus: 503 },
    { variable: "CONTACT_FROM", value: undefined, httpStatus: 503 },
    {
      variable: "CONTACT_FROM",
      value: "FunkSpace <sender@example.test>\r\nBcc: other@example.test",
      httpStatus: 503,
    },
    { variable: "CONTACT_TO", value: undefined, httpStatus: 503 },
    {
      variable: "CONTACT_TO",
      value: "one@example.test,two@example.test",
      httpStatus: 503,
    },
    { variable: "CONTACT_ALLOWED_ORIGINS", value: undefined, httpStatus: 403 },
    {
      variable: "CONTACT_ALLOWED_ORIGINS",
      value: '["https://*.example.test"]',
      httpStatus: 403,
    },
  ])("fails closed for missing/invalid $variable ($value)", async (test) => {
    vi.stubEnv("CONTACT_ENABLED", "true");
    vi.stubEnv(test.variable, test.value);
    expect(createContactServerServices().available).toBe(false);
    const response = await POST(contactRequest());
    expect(response.status).toBe(test.httpStatus);
    expect(await response.json()).toMatchObject({
      code:
        test.httpStatus === 403
          ? "origin_rejected"
          : "configuration_unavailable",
    });
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("composes configured delivery only through an explicit fake fetch and matching provider acceptance", async () => {
    vi.stubEnv("CONTACT_ENABLED", "true");
    // This replaces the shared deny-fetch stub only for this single controlled
    // composition case. It cannot perform transport; all calls are asserted.
    const fetcher = vi.fn<ContactFetch>(async () =>
      Response.json({ id: acceptanceId }),
    );
    vi.stubGlobal("fetch", fetcher);
    expect(createContactServerServices().available).toBe(true);
    const response = await POST(contactRequest());
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ status: "accepted", submissionId });
    expect(fetcher).toHaveBeenCalledOnce();
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init).toMatchObject({
      method: "POST",
      redirect: "error",
      cache: "no-store",
    });
    expect(init.headers).toEqual({
      Authorization: "Bearer " + fakeConfiguration.apiKey,
      "Content-Type": "application/json",
      "Idempotency-Key": "contact/" + submissionId,
    });
    expect(JSON.parse(String(init.body))).toEqual({
      from: fakeConfiguration.from,
      to: [fakeConfiguration.to],
      subject: "FunkSpace contact message",
      reply_to: request.email,
      text: `Name: ${request.name}\nEmail: ${request.email}\n\nMessage:\n${request.message}`,
    });
    expect(init.signal?.aborted).toBe(true);
    expect(console.info).toHaveBeenCalledExactlyOnceWith(
      JSON.stringify({
        event: "contact_outcome",
        httpStatus: 202,
        outcome: "accepted",
        code: null,
      }),
    );
  });

  it("does not trust Host without approved origins and rejects OPTIONS before delivery", async () => {
    vi.stubEnv("CONTACT_ENABLED", "true");
    vi.stubEnv("CONTACT_ALLOWED_ORIGINS", undefined);
    const incoming = contactRequest();
    incoming.headers.set("Host", new URL(origin).host);
    const response = await POST(incoming);
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: "origin_rejected" });
    const options = await OPTIONS(
      new Request(origin + "/api/contact", { method: "OPTIONS" }),
    );
    expect(options.status).toBe(405);
    expect(options.headers.get("allow")).toBe("POST");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
