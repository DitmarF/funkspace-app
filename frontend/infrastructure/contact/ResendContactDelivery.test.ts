// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  acceptanceId,
  bytes,
  chunked,
  fakeConfiguration,
  request,
  validated,
  submissionId,
} from "../../../tests/contact/fixtures";
import { CONTACT_LIMITS } from "@/domain/contact/ContactContract";
import {
  ResendContactDelivery,
  type ContactFetch,
} from "./ResendContactDelivery";

beforeEach(() =>
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] }),
);

function adapter(response: Response) {
  const fetcher = vi.fn<ContactFetch>().mockResolvedValue(response);
  return {
    fetcher,
    delivery: new ResendContactDelivery(fakeConfiguration, fetcher),
  };
}

describe("Resend HTTPS contact adapter", () => {
  it("sends deterministic fixed plain text, structured Reply-To and unchanged idempotency identity", async () => {
    const fetcher = vi
      .fn<ContactFetch>()
      .mockImplementation(async () => Response.json({ id: acceptanceId }));
    const delivery = new ResendContactDelivery(fakeConfiguration, fetcher);
    const value = validated({
      ...request,
      name: " ",
      email: " Visitor@Example.test ",
      message: " A\r\nB ",
    });
    expect(await delivery.deliver(value)).toEqual({
      status: "accepted",
      acceptanceId,
    });
    expect(await delivery.deliver(value)).toEqual({
      status: "accepted",
      acceptanceId,
    });
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
      reply_to: "Visitor@Example.test",
      text: "Name: (not provided)\nEmail: Visitor@Example.test\n\nMessage:\nA\nB",
    });
    expect(fetcher.mock.calls[1][1].body).toBe(init.body);
    expect(fetcher.mock.calls[1][1].headers).toEqual(init.headers);
    expect(init.signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  const errors: [number, string, string, string][] = [
    [400, "validation_error", "failed", "provider_rejected"],
    [400, "invalid_idempotency_key", "failed", "provider_rejected"],
    [401, "missing_api_key", "failed", "provider_rejected"],
    [403, "restricted_api_key", "failed", "provider_rejected"],
    [403, "validation_error", "failed", "provider_rejected"],
    [422, "missing_required_field", "failed", "provider_rejected"],
    [429, "daily_quota_exceeded", "unavailable", "provider_quota_exceeded"],
    [429, "monthly_quota_exceeded", "unavailable", "provider_quota_exceeded"],
    [429, "rate_limit_exceeded", "unavailable", "provider_throttled"],
    [409, "invalid_idempotent_request", "unknown", "idempotency_conflict"],
    [
      409,
      "concurrent_idempotent_requests",
      "unknown",
      "submission_in_progress",
    ],
    [503, "service_unavailable", "unavailable", "provider_unavailable"],
    [500, "application_error", "unknown", "delivery_uncertain"],
    [502, "new_error", "unknown", "delivery_uncertain"],
    [429, "unrecognized", "unknown", "delivery_uncertain"],
    [200, "validation_error", "unknown", "provider_response_invalid"],
  ];
  it.each(errors)(
    "maps provider %s/%s to %s/%s",
    async (httpStatus, name, status, code) => {
      const { delivery, fetcher } = adapter(
        Response.json(
          { name, statusCode: httpStatus, message: "Private provider details" },
          { status: httpStatus },
        ),
      );
      expect(await delivery.deliver(validated())).toEqual({ status, code });
      expect(fetcher).toHaveBeenCalledOnce();
      expect(fetcher.mock.calls[0][1].signal?.aborted).toBe(true);
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it.each([
    {},
    [],
    null,
    { id: "" },
    { id: acceptanceId + "\n" },
    { id: "bad" },
    { id: acceptanceId, name: "validation_error" },
  ])(
    "does not accept missing, malformed or contradictory evidence %j",
    async (data) => {
      expect(
        await adapter(Response.json(data)).delivery.deliver(validated()),
      ).toEqual({ status: "unknown", code: "provider_response_invalid" });
      expect(vi.getTimerCount()).toBe(0);
    },
  );

  it("does not trust an error with mismatched status metadata", async () => {
    const response = Response.json(
      { name: "service_unavailable", statusCode: 400 },
      { status: 503 },
    );
    expect(await adapter(response).delivery.deliver(validated())).toEqual({
      status: "unknown",
      code: "provider_response_invalid",
    });
  });

  it.each([
    new Response("{bad json"),
    new Response("<html>upstream error</html>", { status: 502 }),
    new Response(new Uint8Array([0xc3, 0x28])),
    Response.json({ id: acceptanceId }, { status: 201 }),
    Response.json({ error: "unknown" }, { status: 400 }),
  ])("rejects malformed/invalid provider response %#", async (response) => {
    const result = await adapter(response).delivery.deliver(validated());
    expect(result.status).toBe("unknown");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("bounds response bytes, cancels an oversized stream and releases its lock", async () => {
    const cancel = vi.fn();
    const body = chunked(
      [new Uint8Array(32768), new Uint8Array(1), bytes("more")],
      cancel,
    );
    expect(
      await adapter(new Response(body)).delivery.deliver(validated()),
    ).toEqual({
      status: "unknown",
      code: "provider_response_invalid",
    });
    expect(cancel).toHaveBeenCalledOnce();
    expect(body.locked).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("treats transport failure as possibly sent and clears timers without retrying", async () => {
    const fetcher = vi
      .fn<ContactFetch>()
      .mockRejectedValue(new Error("private response or credential"));
    expect(
      await new ResendContactDelivery(fakeConfiguration, fetcher).deliver(
        validated(),
      ),
    ).toEqual({
      status: "unknown",
      code: "delivery_uncertain",
    });
    expect(fetcher).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("applies the full eight-second deadline to headers and body reading", async () => {
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(bytes('{"id":"'));
      },
      cancel,
    });
    const { delivery, fetcher } = adapter(new Response(body));
    const attempt = delivery.deliver(validated());
    const settled = vi.fn();
    void attempt.then(settled);
    await vi.advanceTimersByTimeAsync(7999);
    expect(settled).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(await attempt).toEqual({
      status: "unknown",
      code: "provider_timeout",
    });
    expect(cancel).toHaveBeenCalledOnce();
    expect(body.locked).toBe(false);
    expect(fetcher.mock.calls[0][1].signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("settles even if fetch ignores cancellation, and cancels a late response", async () => {
    let finish: ((value: Response) => void) | undefined;
    const fetcher = vi.fn<ContactFetch>().mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const attempt = new ResendContactDelivery(
      fakeConfiguration,
      fetcher,
    ).deliver(validated());
    await vi.advanceTimersByTimeAsync(CONTACT_LIMITS.providerDeadlineMs);
    expect(await attempt).toEqual({
      status: "unknown",
      code: "provider_timeout",
    });
    expect(fetcher.mock.calls[0][1].signal?.aborted).toBe(true);
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({ cancel });
    finish?.(new Response(body));
    await vi.advanceTimersByTimeAsync(0);
    expect(cancel).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
    expect(fetcher).toHaveBeenCalledOnce();
  });

  it("does not wait forever for underlying body cancellation or leak rejection", async () => {
    const cancel = vi.fn(() => Promise.reject(new Error("cancel failure")));
    const body = new ReadableStream<Uint8Array>({ cancel });
    const attempt = adapter(new Response(body)).delivery.deliver(validated());
    await vi.advanceTimersByTimeAsync(8000);
    expect(await attempt).toEqual({
      status: "unknown",
      code: "provider_timeout",
    });
    expect(cancel).toHaveBeenCalledOnce();
    expect(body.locked).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
