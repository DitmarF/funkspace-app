// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { contactRequest } from "../../../../tests/contact/fixtures";

const { handle, create } = vi.hoisted(() => ({
  handle: vi.fn<(request: Request) => Promise<Response>>(),
  create: vi.fn(),
}));
vi.mock("@/infrastructure/services/createContactServerServices", () => ({
  createContactServerServices: create,
}));
import {
  POST,
  GET,
  HEAD,
  OPTIONS,
  PUT,
  PATCH,
  DELETE,
  runtime,
  dynamic,
} from "./route";

beforeEach(() => {
  handle.mockReset();
  create.mockReset();
  create.mockReturnValue({ available: false, handle });
});

describe("thin Node-runtime contact route", () => {
  it("delegates per request to server-only composition without constructing client services", async () => {
    expect(runtime).toBe("nodejs");
    expect(dynamic).toBe("force-dynamic");
    const response = Response.json({ status: "unavailable" }, { status: 503 });
    handle.mockResolvedValue(response);
    const request = contactRequest();
    expect(await POST(request)).toBe(response);
    expect(handle).toHaveBeenCalledExactlyOnceWith(request);
    expect(create).toHaveBeenCalledOnce();
    for (const method of [GET, HEAD, OPTIONS, PUT, PATCH, DELETE])
      expect(method).toBe(POST);
  });
});
