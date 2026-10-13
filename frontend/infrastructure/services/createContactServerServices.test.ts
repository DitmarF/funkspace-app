// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import {
  origin,
  contactRequest,
  submissionId,
} from "../../../tests/contact/fixtures";
import { createContactServerServices } from "./createContactServerServices";
import { POST, OPTIONS, runtime } from "@/app/api/contact/route";

describe("production contact composition release lock", () => {
  it("cannot enable live delivery with CONTACT_ENABLED=true and does not call global fetch", async () => {
    vi.stubEnv("CONTACT_ENABLED", "true");
    vi.stubEnv("CONTACT_ALLOWED_ORIGINS", JSON.stringify([origin]));
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
  });

  it("does not trust Host when no approved origin configuration exists", async () => {
    vi.stubEnv("CONTACT_ALLOWED_ORIGINS", undefined);
    const response = await POST(contactRequest());
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: "origin_rejected" });
    const options = await OPTIONS(
      new Request(origin + "/api/contact", { method: "OPTIONS" }),
    );
    expect(options.status).toBe(405);
    expect(options.headers.get("allow")).toBe("POST");
  });
});
