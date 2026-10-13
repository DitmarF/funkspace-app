// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  origin,
  request,
  contactRequest,
  submissionId,
  acceptanceId,
  bytes,
  chunked,
  fakeConfiguration,
} from "../../../tests/contact/fixtures";
import { ContactUseCase } from "@/application/contact/SubmitContact";
import {
  ResendContactDelivery,
  type ContactFetch,
} from "./ResendContactDelivery";
import { createContactRequestHandler } from "./ContactRequestHandler";

function fixture(enabled = true) {
  const deliver = vi
    .fn()
    .mockResolvedValue({ status: "accepted", acceptanceId });
  const useCase = new ContactUseCase(enabled ? { deliver } : null);
  return {
    deliver,
    handle: createContactRequestHandler(
      (input) => useCase.execute(input),
      [origin],
    ),
  };
}

describe("bounded contact HTTP boundary", () => {
  it("accepts controlled delivery and returns only frozen, uncached JSON", async () => {
    const { handle, deliver } = fixture();
    const response = await handle(contactRequest());
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ status: "accepted", submissionId });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(response.headers.has("access-control-allow-origin")).toBe(false);
    expect(deliver).toHaveBeenCalledOnce();
  });

  it.each(["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "DELETE"])(
    "rejects method %s without invoking delivery",
    async (method) => {
      const { handle, deliver } = fixture();
      const response = await handle(
        new Request(origin + "/api/contact", { method }),
      );
      expect(response.status).toBe(405);
      expect(response.headers.get("allow")).toBe("POST");
      expect(await response.json()).toEqual({
        status: "rejected",
        code: "method_not_allowed",
        submissionId: null,
      });
      expect(deliver).not.toHaveBeenCalled();
    },
  );

  it.each([
    "",
    "null",
    "https://attacker.example.test",
    origin + "/",
    "https://portfolio.example.test.attacker.test",
  ])("rejects missing/unapproved exact Origin %j", async (value) => {
    const { handle, deliver } = fixture();
    const input = contactRequest();
    if (value) input.headers.set("origin", value);
    else input.headers.delete("origin");
    input.headers.set("host", new URL(origin).host);
    const response = await handle(input);
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({
      code: "origin_rejected",
      submissionId: null,
    });
    expect(deliver).not.toHaveBeenCalled();
    expect(input.body?.locked).toBe(false);
  });

  it.each([
    "text/plain",
    "application/x-www-form-urlencoded",
    "application/json; charset=latin1",
    "application/json; strange=x",
    "",
  ])("rejects content type %j", async (contentType) => {
    const { handle, deliver } = fixture();
    expect(
      (
        await handle(
          contactRequest(JSON.stringify(request), {
            "content-type": contentType,
          }),
        )
      ).status,
    ).toBe(415);
    expect(deliver).not.toHaveBeenCalled();
  });

  it("accepts UTF-8 JSON spelling and rejects compressed encodings", async () => {
    const { handle, deliver } = fixture();
    expect(
      (
        await handle(
          contactRequest(JSON.stringify(request), {
            "content-type": "Application/JSON; Charset=UTF-8",
          }),
        )
      ).status,
    ).toBe(202);
    expect(
      (
        await handle(
          contactRequest(JSON.stringify(request), {
            "content-encoding": "gzip",
          }),
        )
      ).status,
    ).toBe(415);
    expect(deliver).toHaveBeenCalledOnce();
  });

  const lengths: Record<string, string>[] = [
    {},
    { "content-length": "1" },
    { "content-length": "999999" },
  ];
  it.each(lengths)(
    "counts actual bytes with absent/forged length %j",
    async (headers) => {
      const { handle, deliver } = fixture();
      const encoded = bytes(JSON.stringify(request));
      const exact = new Uint8Array(32768);
      exact.fill(32);
      exact.set(encoded);
      expect(
        (
          await handle(
            contactRequest(
              chunked([exact.subarray(0, 100), exact.subarray(100)]),
              headers,
            ),
          )
        ).status,
      ).toBe(202);
      const cancel = vi.fn();
      const body = chunked([exact, bytes(" "), bytes("unread")], cancel);
      const response = await handle(contactRequest(body, headers));
      expect(response.status).toBe(413);
      expect(await response.json()).toEqual({
        status: "rejected",
        code: "request_too_large",
        submissionId: null,
      });
      expect(cancel).toHaveBeenCalledOnce();
      expect(body.locked).toBe(false);
      expect(deliver).toHaveBeenCalledOnce();
    },
  );

  it("counts multibyte UTF-8 across chunk boundaries", async () => {
    const { handle } = fixture();
    const encoded = bytes(JSON.stringify({ ...request, name: "Zoë 💎" }));
    const chunks = [...encoded].map((value) => new Uint8Array([value]));
    expect((await handle(contactRequest(chunked(chunks)))).status).toBe(202);
  });

  it.each([
    [new Uint8Array([0xc3, 0x28]), "invalid_utf8"],
    [new Uint8Array([0xe2, 0x82]), "invalid_utf8"],
    [bytes("{bad"), "malformed_json"],
    [bytes("\ufeff" + JSON.stringify(request)), "malformed_json"],
    [bytes(""), "malformed_json"],
  ] as const)(
    "rejects fatal UTF-8/JSON without delivery %#",
    async (body, code) => {
      const { handle, deliver } = fixture();
      const response = await handle(contactRequest(chunked([body])));
      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({
        status: "rejected",
        code,
        submissionId: null,
      });
      expect(deliver).not.toHaveBeenCalled();
    },
  );

  it("rejects absent/erroring/aborted request bodies and releases resources", async () => {
    const { handle, deliver } = fixture();
    expect((await handle(contactRequest(null))).status).toBe(400);
    const errorBody = new ReadableStream<Uint8Array>({
      start(c) {
        c.error(new Error("private stream error"));
      },
    });
    expect((await handle(contactRequest(errorBody))).status).toBe(400);
    expect(errorBody.locked).toBe(false);
    const controller = new AbortController();
    const body = new ReadableStream<Uint8Array>();
    const input = new Request(origin + "/api/contact", {
      method: "POST",
      headers: { origin, "content-type": "application/json" },
      body,
      signal: controller.signal,
      duplex: "half",
    } as RequestInit & { duplex: "half" });
    const attempt = handle(input);
    controller.abort();
    expect((await attempt).status).toBe(400);
    expect(body.locked).toBe(false);
    expect(deliver).not.toHaveBeenCalled();
  });

  it.each([
    [{ ...request, name: 3 }, 400, "invalid_shape"],
    [{ ...request, unexpected: "" }, 400, "invalid_shape"],
    [{ ...request, submissionId: "bad" }, 400, "invalid_submission_id"],
    [{ ...request, website: " " }, 400, "spam_rejected"],
    [
      { ...request, email: "visitor@example.test\r\nBcc:x" },
      422,
      "validation_failed",
    ],
    [{ ...request, name: "n".repeat(101) }, 422, "validation_failed"],
    [{ ...request, message: "m".repeat(5001) }, 422, "validation_failed"],
  ] as const)(
    "rejects strict shape/fields before the adapter %#",
    async (body, status, code) => {
      const { handle, deliver } = fixture();
      const response = await handle(contactRequest(JSON.stringify(body)));
      expect(response.status).toBe(status);
      expect(await response.json()).toMatchObject({ code });
      expect(deliver).not.toHaveBeenCalled();
    },
  );

  it("returns unavailable for a valid request when configuration is off", async () => {
    const { handle, deliver } = fixture(false);
    const response = await handle(contactRequest());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      status: "unavailable",
      code: "configuration_unavailable",
      submissionId,
    });
    expect(deliver).not.toHaveBeenCalled();
  });

  it("integrates real use case/adapter with injected HTTPS fake and preserves uncertainty", async () => {
    const fetcher = vi
      .fn<ContactFetch>()
      .mockResolvedValueOnce(Response.json({ id: acceptanceId }))
      .mockResolvedValueOnce(
        Response.json(
          { name: "concurrent_idempotent_requests" },
          { status: 409 },
        ),
      );
    const useCase = new ContactUseCase(
      new ResendContactDelivery(fakeConfiguration, fetcher),
    );
    const handle = createContactRequestHandler(
      (input) => useCase.execute(input),
      [origin],
    );
    expect((await handle(contactRequest())).status).toBe(202);
    const retry = await handle(contactRequest());
    expect(retry.status).toBe(502);
    expect(await retry.json()).toEqual({
      status: "unknown",
      code: "submission_in_progress",
      submissionId,
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[1][1].body).toBe(fetcher.mock.calls[0][1].body);
    expect(fetcher.mock.calls[1][1].headers).toEqual(
      fetcher.mock.calls[0][1].headers,
    );
  });
});
