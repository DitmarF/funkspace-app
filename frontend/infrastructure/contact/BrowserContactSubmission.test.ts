// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  request,
  submissionId,
  bytes,
  chunked,
} from "../../../tests/contact/fixtures";
import { BrowserContactSubmission } from "./BrowserContactSubmission";

const signal = () => new AbortController().signal;
function fixture(response: Response) {
  const fetcher = vi.fn().mockResolvedValue(response);
  return { fetcher, port: new BrowserContactSubmission(fetcher) };
}
describe("same-origin contact submission", () => {
  it("counts device sleep even if the performance clock pauses, and fails safe on clock rollback", () => {
    vi.useFakeTimers({
      toFake: ["Date", "performance", "setTimeout", "clearTimeout"],
    });
    vi.setSystemTime(100000);
    const { port } = fixture(new Response(null));
    const first = port.now();
    vi.setSystemTime(100000 + 24 * 60 * 60 * 1000);
    expect(port.now() - first).toBeGreaterThanOrEqual(23 * 60 * 60 * 1000);
    const beforeRollback = port.now();
    vi.setSystemTime(1);
    expect(port.now() - beforeRollback).toBeGreaterThanOrEqual(
      23 * 60 * 60 * 1000,
    );
  });
  it("does not accept a response after device sleep beyond the browser deadline", async () => {
    vi.useFakeTimers({
      toFake: ["Date", "performance", "setTimeout", "clearTimeout"],
    });
    vi.setSystemTime(100000);
    const fetcher = vi.fn(async () => {
      vi.setSystemTime(120000); // Wall clock advances while performance stays at zero.
      return Response.json(
        { status: "accepted", submissionId },
        { status: 202 },
      );
    });
    expect(
      await new BrowserContactSubmission(fetcher).submit(request, signal()),
    ).toEqual({ kind: "unknown", reason: "timeout" });
    expect(vi.getTimerCount()).toBe(0);
  });
  it("posts once with cookies and no redirects/storage/provider call", async () => {
    const { port, fetcher } = fixture(
      Response.json({ status: "accepted", submissionId }, { status: 202 }),
    );
    const result = await port.submit(request, signal());
    expect(result).toEqual({
      kind: "response",
      result: { httpStatus: 202, body: { status: "accepted", submissionId } },
    });
    expect(fetcher).toHaveBeenCalledExactlyOnceWith(
      "/api/contact",
      expect.objectContaining({
        method: "POST",
        redirect: "error",
        cache: "no-store",
        credentials: "same-origin",
        body: JSON.stringify(request),
      }),
    );
    expect(fetcher.mock.calls[0][1].signal.aborted).toBe(true);
    expect(port.createSubmissionId()).toMatch(/^[\da-f-]{36}$/);
    expect(port.now()).toBeGreaterThanOrEqual(0);
  });
  it.each([null, "<html>blocked</html>", "", '{"status":"rate_limited"}'])(
    "recognizes any 429 without reading its body %j",
    async (body) => {
      const { port } = fixture(new Response(body, { status: 429 }));
      expect(await port.submit(request, signal())).toEqual({
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
    },
  );
  it.each([
    ["10", 10],
    ["600", 600],
    ["0", null],
    ["601", null],
    ["junk", null],
    ["1.2", null],
    ["Tue, 13 Oct 2026 22:00:00 GMT", null],
  ] as const)("bounds Retry-After %s", async (header, value) => {
    const { port } = fixture(
      new Response(null, { status: 429, headers: { "Retry-After": header } }),
    );
    expect(await port.submit(request, signal())).toMatchObject({
      result: { body: { retryAfterSeconds: value } },
    });
  });
  it.each([
    Response.json({ status: "accepted", submissionId: "bad" }, { status: 202 }),
    Response.json(
      { status: "accepted", submissionId, extra: true },
      { status: 202 },
    ),
    Response.json({ status: "accepted", submissionId }, { status: 200 }),
    new Response("<html>protected</html>"),
    new Response(bytes("\ufeff{}")),
    new Response(new Uint8Array([0xc3, 0x28])),
  ])(
    "treats mismatched/malformed/protection responses as uncertain %#",
    async (response) => {
      expect(
        (await fixture(response).port.submit(request, signal())).kind,
      ).toBe("unknown");
    },
  );
  it("returns transport uncertainty without retry", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("private error"));
    expect(
      await new BrowserContactSubmission(fetcher).submit(request, signal()),
    ).toEqual({ kind: "unknown", reason: "transport" });
    expect(fetcher).toHaveBeenCalledOnce();
  });
  it("bounds response bytes and cancels/releases the reader", async () => {
    const cancel = vi.fn();
    const body = chunked([new Uint8Array(32769), bytes("more")], cancel);
    expect(
      (await fixture(new Response(body)).port.submit(request, signal())).kind,
    ).toBe("unknown");
    expect(cancel).toHaveBeenCalledOnce();
    expect(body.locked).toBe(false);
  });
  it("15-second deadline includes a stalled response body; releases timers/readers", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout", "performance"] });
    const cancel = vi.fn();
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(bytes('{"status":'));
      },
      cancel,
    });
    const { port, fetcher } = fixture(new Response(body));
    const promise = port.submit(request, signal());
    await vi.advanceTimersByTimeAsync(15000);
    expect(await promise).toEqual({ kind: "unknown", reason: "timeout" });
    expect(cancel).toHaveBeenCalledOnce();
    expect(body.locked).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    expect(fetcher).toHaveBeenCalledOnce();
  });
  it("aborts on unmount/caller cancellation even if fetch ignores the signal", async () => {
    let resolve: ((r: Response) => void) | undefined;
    const fetcher = vi.fn(
      () =>
        new Promise<Response>((done) => {
          resolve = done;
        }),
    );
    const controller = new AbortController();
    const promise = new BrowserContactSubmission(fetcher).submit(
      request,
      controller.signal,
    );
    controller.abort();
    expect(await promise).toEqual({ kind: "unknown", reason: "cancelled" });
    const cancel = vi.fn();
    resolve?.(new Response(new ReadableStream({ cancel })));
    await Promise.resolve();
    await Promise.resolve();
    expect(cancel).toHaveBeenCalledOnce();
  });
  it("never sends when already cancelled", async () => {
    const fetcher = vi.fn();
    const c = new AbortController();
    c.abort();
    expect(
      await new BrowserContactSubmission(fetcher).submit(request, c.signal),
    ).toEqual({ kind: "unknown", reason: "cancelled" });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
