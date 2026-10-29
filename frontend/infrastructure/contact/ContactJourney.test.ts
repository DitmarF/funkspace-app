// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ContactUseCase } from "@/application/contact/SubmitContact";
import { CONTACT_LIMITS } from "@/domain/contact/ContactContract";
import {
  acceptanceId,
  bytes,
  fakeConfiguration,
  origin,
  request,
  submissionId,
} from "../../../tests/contact/fixtures";
import { BrowserContactSubmission } from "./BrowserContactSubmission";
import { createContactRequestHandler } from "./ContactRequestHandler";
import {
  ResendContactDelivery,
  type ContactFetch,
} from "./ResendContactDelivery";

beforeEach(() =>
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] }),
);

/** In-process HTTP bridge only; the shared fixture rejects all global fetch. */
function journey(
  provider: ContactFetch,
  options: {
    enabled?: boolean;
    browserOrigin?: string;
    edgeLimited?: boolean;
  } = {},
) {
  const providerFetch = vi.fn<ContactFetch>(provider);
  const delivery = new ResendContactDelivery(fakeConfiguration, providerFetch);
  const useCase = new ContactUseCase(
    options.enabled === false ? null : delivery,
  );
  const handle = vi.fn(
    createContactRequestHandler((input) => useCase.execute(input), [origin]),
  );
  const browserFetch = vi.fn<ContactFetch>(async (url, init) => {
    if (options.edgeLimited)
      return new Response("<html>Too many requests</html>", {
        status: 429,
        headers: { "Content-Type": "text/html" },
      });
    // A browser supplies Origin; Request in this Node bridge does not.
    const headers = new Headers(init.headers);
    headers.set("Origin", options.browserOrigin ?? origin);
    return handle(new Request(new URL(url, origin), { ...init, headers }));
  });
  const browser = new BrowserContactSubmission(browserFetch);
  return {
    providerFetch,
    browserFetch,
    handle,
    submit: (input = request) =>
      browser.submit(input, new AbortController().signal),
  };
}

describe("mocked browser → boundary → use case → Resend journey", () => {
  it("accepts only provider evidence and preserves payload/key for an explicit unchanged retry", async () => {
    const provider = vi
      .fn<ContactFetch>()
      .mockRejectedValueOnce(new Error("Private transport detail"))
      .mockImplementation(async () => Response.json({ id: acceptanceId }));
    const flow = journey(provider);
    const input = {
      ...request,
      name: " Visitor ",
      email: " Visitor@Example.test ",
      message: " First line\r\nSecond line ",
    };
    expect(await flow.submit(input)).toEqual({
      kind: "response",
      result: {
        httpStatus: 502,
        body: { status: "unknown", code: "delivery_uncertain", submissionId },
      },
    });
    expect(flow.providerFetch).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0); // No automatic retry is scheduled.

    const result = await flow.submit(input); // An explicit manual retry only.
    expect(result).toEqual({
      kind: "response",
      result: { httpStatus: 202, body: { status: "accepted", submissionId } },
    });
    expect(JSON.stringify(result)).not.toContain(acceptanceId);
    expect(flow.providerFetch).toHaveBeenCalledTimes(2);
    expect(flow.browserFetch).toHaveBeenCalledTimes(2);
    const [url, first] = flow.providerFetch.mock.calls[0];
    const [, second] = flow.providerFetch.mock.calls[1];
    expect(url).toBe("https://api.resend.com/emails");
    expect(first.headers).toEqual({
      Authorization: "Bearer " + fakeConfiguration.apiKey,
      "Content-Type": "application/json",
      "Idempotency-Key": "contact/" + submissionId,
    });
    expect(JSON.parse(String(first.body))).toEqual({
      from: fakeConfiguration.from,
      to: [fakeConfiguration.to],
      subject: "FunkSpace contact message",
      reply_to: "Visitor@Example.test",
      text: "Name: Visitor\nEmail: Visitor@Example.test\n\nMessage:\nFirst line\nSecond line",
    });
    expect(second.body).toBe(first.body);
    expect(second.headers).toEqual(first.headers);
    expect(first.signal?.aborted).toBe(true);
    expect(second.signal?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("carries malformed provider evidence through every layer as uncertain, never accepted", async () => {
    const flow = journey(async () => new Response("{malformed"));
    expect(await flow.submit()).toEqual({
      kind: "response",
      result: {
        httpStatus: 502,
        body: {
          status: "unknown",
          code: "provider_response_invalid",
          submissionId,
        },
      },
    });
    expect(flow.providerFetch).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("distinguishes provider quota exhaustion from a non-JSON edge 429", async () => {
    const provider = async () =>
      Response.json({ name: "daily_quota_exceeded" }, { status: 429 });
    const quota = journey(provider);
    expect(await quota.submit()).toEqual({
      kind: "response",
      result: {
        httpStatus: 503,
        body: {
          status: "unavailable",
          code: "provider_quota_exceeded",
          submissionId,
        },
      },
    });
    expect(quota.providerFetch).toHaveBeenCalledOnce();

    const edge = journey(provider, { edgeLimited: true });
    expect(await edge.submit()).toEqual({
      kind: "response",
      result: {
        httpStatus: 429,
        body: {
          status: "rate_limited",
          code: "rate_limited",
          submissionId,
          retryAfterSeconds: null,
        },
      },
    });
    expect(edge.handle).not.toHaveBeenCalled();
    expect(edge.providerFetch).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([
    {
      label: "header injection",
      input: {
        ...request,
        email: "visitor@example.test\r\nBcc: other@example.test",
      },
      browserOrigin: origin,
      httpStatus: 422,
      code: "validation_failed",
    },
    {
      label: "populated spam trap",
      input: { ...request, website: " " },
      browserOrigin: origin,
      httpStatus: 400,
      code: "spam_rejected",
    },
    {
      label: "unapproved origin",
      input: request,
      browserOrigin: "https://attacker.example.test",
      httpStatus: 403,
      code: "origin_rejected",
    },
  ])("rejects $label before provider invocation", async (test) => {
    const flow = journey(async () => Response.json({ id: acceptanceId }), {
      browserOrigin: test.browserOrigin,
    });
    expect(await flow.submit(test.input)).toMatchObject({
      kind: "response",
      result: { httpStatus: test.httpStatus, body: { code: test.code } },
    });
    expect(flow.handle).toHaveBeenCalledOnce();
    expect(flow.providerFetch).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("preserves the disabled result all the way to the browser without touching delivery", async () => {
    const flow = journey(async () => Response.json({ id: acceptanceId }), {
      enabled: false,
    });
    expect(await flow.submit()).toEqual({
      kind: "response",
      result: {
        httpStatus: 503,
        body: {
          status: "unavailable",
          code: "configuration_unavailable",
          submissionId,
        },
      },
    });
    expect(flow.providerFetch).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("delivers the eight-second provider timeout before the browser deadline and releases resources", async () => {
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(bytes('{"id":"'));
      },
      cancel,
    });
    const flow = journey(async () => new Response(body));
    const result = flow.submit();
    await vi.advanceTimersByTimeAsync(CONTACT_LIMITS.providerDeadlineMs);
    expect(await result).toEqual({
      kind: "response",
      result: {
        httpStatus: 504,
        body: { status: "unknown", code: "provider_timeout", submissionId },
      },
    });
    expect(flow.providerFetch).toHaveBeenCalledOnce();
    expect(flow.providerFetch.mock.calls[0][1].signal?.aborted).toBe(true);
    expect(cancel).toHaveBeenCalledOnce();
    expect(body.locked).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
