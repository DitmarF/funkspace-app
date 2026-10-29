// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { CONTACT_LIMITS } from "@/domain/contact/ContactContract";
import {
  ManualContactSubmission,
  createManualSubmissionId,
  type ManualScenario,
} from "./ManualContactSubmission";

const request = () => ({
  name: "",
  email: "example@example.com",
  message: "Sample text",
  website: "",
  submissionId: createManualSubmissionId(),
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
describe("Storybook-only contact transport", () => {
  it("uses v4 UUIDs on HTTP LAN without randomUUID", () => {
    vi.spyOn(crypto, "randomUUID").mockImplementation(() => {
      throw new Error("HTTPS only");
    });
    expect(createManualSubmissionId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });
  it.each([
    "accepted",
    "field_errors",
    "configuration",
    "quota",
    "throttled",
    "unavailable",
    "rejected",
    "provider_rejected",
    "provider_timeout",
    "uncertain",
    "provider_invalid",
    "in_progress",
    "conflict",
  ] as ManualScenario[])(
    "passes %s through the actual response parser without egress",
    async (scenario) => {
      const fetch = vi
        .spyOn(globalThis, "fetch")
        .mockRejectedValue(new Error("Forbidden egress"));
      const port = new ManualContactSubmission();
      port.select(scenario);
      const result = await port.submit(request(), new AbortController().signal);
      expect(result.kind).toBe("response");
      expect(fetch).not.toHaveBeenCalled();
      expect(port.getSnapshot().active).toBe(false);
    },
  );
  it.each(["network_error", "malformed", "mismatched"] as ManualScenario[])(
    "keeps %s uncertain",
    async (scenario) => {
      const port = new ManualContactSubmission();
      port.select(scenario);
      expect(
        (await port.submit(request(), new AbortController().signal)).kind,
      ).toBe("unknown");
    },
  );
  it.each(["rate_json", "rate_html", "rate_empty"] as ManualScenario[])(
    "recognizes %s independently of its body",
    async (scenario) => {
      const port = new ManualContactSubmission();
      port.select(scenario);
      const result = await port.submit(request(), new AbortController().signal);
      expect(result.kind === "response" && result.result.body.status).toBe(
        "rate_limited",
      );
      if (
        result.kind === "response" &&
        result.result.body.status === "rate_limited"
      )
        expect(result.result.body.retryAfterSeconds).toBe(
          scenario === "rate_empty" ? null : 5,
        );
    },
  );
  it.each(["fetch_timeout", "body_timeout"] as ManualScenario[])(
    "uses the real 15s adapter deadline and cleans %s resources",
    async (scenario) => {
      vi.useFakeTimers();
      const port = new ManualContactSubmission();
      port.select(scenario);
      const promise = port.submit(request(), new AbortController().signal);
      await vi.advanceTimersByTimeAsync(CONTACT_LIMITS.browserDeadlineMs - 1);
      expect(port.getSnapshot().active).toBe(true);
      await vi.advanceTimersByTimeAsync(1);
      expect(await promise).toEqual({ kind: "unknown", reason: "timeout" });
      expect(port.getSnapshot().active).toBe(false);
      expect(
        scenario === "fetch_timeout"
          ? port.getSnapshot().aborts
          : port.getSnapshot().bodyCancellations,
      ).toBe(1);
      expect(vi.getTimerCount()).toBe(0);
    },
  );
  it("holds the captured response and preserves caller retry identity across scenario changes", async () => {
    const port = new ManualContactSubmission();
    const payload = request();
    port.select("held");
    const first = port.submit(payload, new AbortController().signal);
    port.select("network_error");
    port.release(true);
    const result = await first;
    expect(result.kind === "response" && result.result.body).toEqual({
      status: "accepted",
      submissionId: payload.submissionId,
    });
    await port.submit(payload, new AbortController().signal);
    expect(port.getSnapshot()).toMatchObject({
      lastId: payload.submissionId,
      previousId: payload.submissionId,
      requests: 2,
    });
    expect(Object.keys(port.getSnapshot())).not.toContain("email");
  });
  it("advances only the form retry clock, cancels held work and never stores drafts", async () => {
    const port = new ManualContactSubmission();
    const before = port.now();
    port.advanceRetryWindow();
    expect(port.now() - before).toBeGreaterThanOrEqual(
      CONTACT_LIMITS.sameSubmissionRetryMs,
    );
    port.select("held");
    const abort = new AbortController();
    const pending = port.submit(request(), abort.signal);
    abort.abort();
    expect(await pending).toEqual({ kind: "unknown", reason: "cancelled" });
    expect(port.getSnapshot()).toMatchObject({ active: false, aborts: 1 });
    port.dispose();
  });
});
