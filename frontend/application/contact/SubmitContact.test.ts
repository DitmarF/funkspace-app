// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  request,
  submissionId,
  acceptanceId,
} from "../../../tests/contact/fixtures";
import type { ContactDeliveryOutcome } from "@/domain/ports/ContactDeliveryPort";
import { ContactUseCase } from "./SubmitContact";

describe("contact application use case", () => {
  it("cannot invoke delivery for rejected or invalid input", async () => {
    const deliver = vi.fn();
    const useCase = new ContactUseCase({ deliver });
    for (const input of [
      null,
      { ...request, email: "" },
      { ...request, name: "\r\nBcc:x" },
      { ...request, website: "bot" },
    ]) {
      expect((await useCase.execute(input)).httpStatus).not.toBe(202);
    }
    expect(deliver).not.toHaveBeenCalled();
  });

  it("fails closed while retaining a safely validated identifier", async () => {
    const useCase = new ContactUseCase(null);
    expect(await useCase.execute(request)).toEqual({
      httpStatus: 503,
      body: {
        status: "unavailable",
        code: "configuration_unavailable",
        submissionId,
      },
    });
    expect(
      (await useCase.execute({ ...request, message: "" })).httpStatus,
    ).toBe(422);
  });

  it("passes only normalized validated data and hides the provider identifier", async () => {
    const deliver = vi
      .fn()
      .mockResolvedValue({ status: "accepted", acceptanceId });
    const result = await new ContactUseCase({ deliver }).execute({
      ...request,
      name: " Visitor ",
      message: "A\r\nB",
    });
    expect(deliver).toHaveBeenCalledExactlyOnceWith({
      ...request,
      name: "Visitor",
      message: "A\nB",
    });
    expect(result).toEqual({
      httpStatus: 202,
      body: { status: "accepted", submissionId },
    });
    expect(JSON.stringify(result)).not.toContain(acceptanceId);
  });

  it("rejects a port claiming acceptance without valid evidence", async () => {
    const result = await new ContactUseCase({
      deliver: vi
        .fn()
        .mockResolvedValue({ status: "accepted", acceptanceId: "bad" }),
    }).execute(request);
    expect(result).toMatchObject({
      httpStatus: 502,
      body: { status: "unknown", code: "provider_response_invalid" },
    });
  });

  const outcomes: [ContactDeliveryOutcome, number][] = [
    [{ status: "failed", code: "provider_rejected" }, 502],
    [{ status: "unavailable", code: "configuration_unavailable" }, 503],
    [{ status: "unavailable", code: "provider_quota_exceeded" }, 503],
    [{ status: "unavailable", code: "provider_throttled" }, 503],
    [{ status: "unavailable", code: "provider_unavailable" }, 503],
    [{ status: "unknown", code: "delivery_uncertain" }, 502],
    [{ status: "unknown", code: "provider_response_invalid" }, 502],
    [{ status: "unknown", code: "idempotency_conflict" }, 502],
    [{ status: "unknown", code: "submission_in_progress" }, 502],
    [{ status: "unknown", code: "provider_timeout" }, 504],
  ];
  it.each(outcomes)(
    "maps %j honestly to HTTP %s without retrying",
    async (outcome, httpStatus) => {
      const deliver = vi.fn().mockResolvedValue(outcome);
      expect(await new ContactUseCase({ deliver }).execute(request)).toEqual({
        httpStatus,
        body: { ...outcome, submissionId },
      });
      expect(deliver).toHaveBeenCalledOnce();
    },
  );

  it("maps an exceptional adapter failure to uncertain delivery, without raw error", async () => {
    const deliver = vi
      .fn()
      .mockRejectedValue(new Error("Sensitive provider content"));
    expect(await new ContactUseCase({ deliver }).execute(request)).toEqual({
      httpStatus: 502,
      body: { status: "unknown", code: "delivery_uncertain", submissionId },
    });
    expect(deliver).toHaveBeenCalledOnce();
  });

  it("allowlists public error fields even if a port carries private metadata", async () => {
    const deliver = vi.fn().mockResolvedValue({
      status: "failed",
      code: "provider_rejected",
      acceptanceId,
      rawProviderError: "Private adapter metadata",
    });
    expect(await new ContactUseCase({ deliver }).execute(request)).toEqual({
      httpStatus: 502,
      body: { status: "failed", code: "provider_rejected", submissionId },
    });
  });

  it("does not rotate identity or schedule retries after an uncertain attempt", async () => {
    const deliver = vi
      .fn()
      .mockResolvedValue({ status: "unknown", code: "delivery_uncertain" });
    const useCase = new ContactUseCase({ deliver });
    await useCase.execute(request);
    expect(deliver).toHaveBeenCalledOnce();
    await useCase.execute(request); // Explicit unchanged manual retry.
    expect(deliver.mock.calls.map(([value]) => value.submissionId)).toEqual([
      submissionId,
      submissionId,
    ]);
  });
});
