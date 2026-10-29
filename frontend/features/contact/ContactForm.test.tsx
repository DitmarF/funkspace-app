import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ContactForm from "./ContactForm";
import { CONTACT_LIMITS } from "@/domain/contact/ContactContract";

const fixture = vi.hoisted(() => ({
  clock: 0,
  port: { submit: vi.fn(), createSubmissionId: vi.fn(), now: vi.fn() },
}));
vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => ({ contactSubmission: fixture.port }),
}));
const id = "50a1a2b3-4567-4abc-8def-123456789abc";
const id2 = "50a1a2b3-4567-4abc-8def-999999999999";
beforeEach(() => {
  fixture.clock = 0;
  fixture.port.submit.mockReset();
  fixture.port.createSubmissionId.mockReset();
  fixture.port.now.mockImplementation(() => fixture.clock);
  fixture.port.createSubmissionId.mockReturnValue(id);
  fixture.port.submit.mockResolvedValue({
    kind: "unknown",
    reason: "transport",
  });
});
afterEach(() => vi.useRealTimers());
function fill() {
  fireEvent.change(screen.getByLabelText(/Name/), {
    target: { value: " Visitor " },
  });
  fireEvent.change(screen.getByLabelText(/Email/), {
    target: { value: "visitor@example.test" },
  });
  fireEvent.change(screen.getByLabelText(/Message/), {
    target: { value: " A\r\nmessage " },
  });
}
function submit() {
  fireEvent.submit(screen.getByRole("form", { name: "Contact inquiry" }));
}
function accepted() {
  fixture.port.submit.mockImplementation(async (payload) => ({
    kind: "response",
    result: {
      httpStatus: 202,
      body: { status: "accepted", submissionId: payload.submissionId },
    },
  }));
}

describe("plain contact form", () => {
  it("rechecks expiry on page wake/focus without waiting for a suspended timer", async () => {
    render(<ContactForm available />);
    fill();
    submit();
    await screen.findByText(/couldn’t confirm delivery/);
    fixture.clock = CONTACT_LIMITS.sameSubmissionRetryMs;
    fireEvent(window, new Event("focus"));
    expect(screen.getByRole("button", { name: /Retry/ })).toBeDisabled();
    submit();
    expect(fixture.port.submit).toHaveBeenCalledOnce();
  });
  it.each([false, true])(
    "server-renders visible disabled fields before hydration (available=%s)",
    (available) => {
      const container = document.createElement("div");
      container.innerHTML = renderToString(
        <ContactForm available={available} />,
      );
      expect(container.querySelector("form")).not.toBeNull();
      for (const field of ["name", "email", "message", "website"])
        expect(container.querySelector(`[name="${field}"]`)).toBeDisabled();
      expect(container.querySelector("button")).toBeDisabled();
      expect(container.querySelector("button")).toHaveAttribute(
        "type",
        "button",
      );
      expect(container.textContent).toContain("Sending is currently disabled");
      expect(fixture.port.submit).not.toHaveBeenCalled();
    },
  );
  it("keeps visible fields disabled and rejects synthetic submission while unavailable", () => {
    render(<ContactForm available={false} />);
    expect(screen.getByText(/Sending is currently disabled/)).toBeVisible();
    const form = screen.getByRole("form", { name: "Contact inquiry" });
    expect(form).toHaveAccessibleDescription(
      "Sending is currently disabled. Please contact me by email.",
    );
    for (const label of [/Name/, /Email/, /Message/]) {
      expect(screen.getByLabelText(label)).toBeVisible();
      expect(screen.getByLabelText(label)).toBeDisabled();
    }
    const send = screen.getByRole("button", { name: "Send message" });
    expect(send).toBeDisabled();
    fill();
    fireEvent.click(send);
    submit();
    expect(screen.getByLabelText(/Name/)).toHaveValue("");
    expect(fixture.port.createSubmissionId).not.toHaveBeenCalled();
    expect(fixture.port.submit).not.toHaveBeenCalled();
  });
  it("uses shared fields, required/error associations and an inaccessible trap without dedicated status", async () => {
    render(<ContactForm available />);
    const email = screen.getByLabelText(/Email/);
    const message = screen.getByLabelText(/Message/);
    expect(email).toHaveAttribute("type", "email");
    expect(email).toHaveAttribute("inputmode", "email");
    expect(email).toHaveAttribute("autocomplete", "email");
    expect(email).toBeRequired();
    expect(message).toBeRequired();
    expect(screen.getByLabelText(/Name/)).not.toBeRequired();
    submit();
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute("aria-invalid", "true");
    for (const element of [email, message]) {
      const described = element
        .getAttribute("aria-describedby")!
        .split(" ")
        .map((key) => document.getElementById(key));
      expect(described.every(Boolean)).toBe(true);
      expect(
        described.some((node) => node?.textContent?.includes("Error:")),
      ).toBe(true);
    }
    const trap = document.querySelector('input[name="website"]')!;
    expect(trap).toHaveAttribute("hidden");
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap).toHaveAttribute("aria-hidden", "true");
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
    expect(fixture.port.submit).not.toHaveBeenCalled();
  });
  it("guards synchronous duplicate click/Enter/form dispatch and keeps fields read-only internally", async () => {
    let finish: ((value: unknown) => void) | undefined;
    fixture.port.submit.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    render(<ContactForm available />);
    fill();
    submit();
    submit();
    fireEvent.click(screen.getByRole("button", { name: /Retry same message/ }));
    expect(fixture.port.submit).toHaveBeenCalledOnce();
    for (const label of [/Name/, /Email/, /Message/])
      expect(screen.getByLabelText(label)).toHaveAttribute("readonly");
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByText(/Sending|Working/)).toBeNull();
    await act(async () => finish?.({ kind: "unknown", reason: "timeout" }));
    expect(screen.getByText(/couldn’t confirm delivery/)).toHaveFocus();
    expect(screen.getByLabelText(/Name/)).toHaveValue(" Visitor ");
  });
  it.each([
    [400, "rejected", "spam_rejected"],
    [403, "rejected", "origin_rejected"],
    [413, "rejected", "request_too_large"],
    [415, "rejected", "unsupported_media_type"],
    [502, "failed", "provider_rejected"],
    [502, "unknown", "delivery_uncertain"],
    [502, "unknown", "provider_response_invalid"],
    [502, "unknown", "submission_in_progress"],
    [504, "unknown", "provider_timeout"],
    [503, "unavailable", "provider_quota_exceeded"],
    [503, "unavailable", "provider_throttled"],
    [503, "unavailable", "provider_unavailable"],
    [503, "unavailable", "configuration_unavailable"],
  ])(
    "preserves all input for %s/%s/%s and focuses plain feedback",
    async (httpStatus, status, code) => {
      fixture.port.submit.mockResolvedValue({
        kind: "response",
        result: { httpStatus, body: { status, code, submissionId: id } },
      });
      render(<ContactForm available />);
      fill();
      submit();
      await waitFor(() =>
        expect(
          screen.getByText(/text is still here|couldn’t confirm delivery/),
        ).toHaveFocus(),
      );
      expect(screen.getByLabelText(/Name/)).toHaveValue(" Visitor ");
      expect(screen.getByLabelText(/Email/)).toHaveValue(
        "visitor@example.test",
      );
      expect(screen.getByLabelText(/Message/)).toHaveValue(" A\nmessage ");
      expect(screen.queryByText(/accepted for delivery/)).toBeNull();
      expect(fixture.port.submit).toHaveBeenCalledOnce();
    },
  );
  it("associates controlled server field errors and focuses the first invalid field", async () => {
    fixture.port.submit.mockResolvedValue({
      kind: "response",
      result: {
        httpStatus: 422,
        body: {
          status: "invalid",
          code: "validation_failed",
          submissionId: id,
          fieldErrors: { name: "too_long", email: "invalid_email" },
        },
      },
    });
    render(<ContactForm available />);
    fill();
    submit();
    await waitFor(() => expect(screen.getByLabelText(/Name/)).toHaveFocus());
    expect(screen.getByLabelText(/Email/)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByText(/Name is too long/)).toBeVisible();
  });
  it("preserves an unchanged retry key/payload, but edit-and-restore retires it and explains uncertainty", async () => {
    fixture.port.createSubmissionId
      .mockReturnValueOnce(id)
      .mockReturnValue(id2);
    render(<ContactForm available />);
    fill();
    submit();
    await screen.findByText(/couldn’t confirm delivery/);
    submit();
    await waitFor(() => expect(fixture.port.submit).toHaveBeenCalledTimes(2));
    expect(fixture.port.submit.mock.calls[1][0]).toEqual(
      fixture.port.submit.mock.calls[0][0],
    );
    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: "Other" },
    });
    fireEvent.change(screen.getByLabelText(/Name/), {
      target: { value: " Visitor " },
    });
    expect(screen.getByText(/Editing creates a new message/)).toBeVisible();
    submit();
    await waitFor(() => expect(fixture.port.submit).toHaveBeenCalledTimes(3));
    expect(fixture.port.submit.mock.calls[2][0].submissionId).toBe(id2);
  });
  it("blocks same-key retry at exactly 23 hours and preserves text", async () => {
    vi.useFakeTimers();
    render(<ContactForm available />);
    fill();
    await act(async () => submit());
    fixture.clock = CONTACT_LIMITS.sameSubmissionRetryMs;
    await act(async () =>
      vi.advanceTimersByTime(CONTACT_LIMITS.sameSubmissionRetryMs),
    );
    expect(screen.getByText(/retry window has ended/)).toBeVisible();
    expect(screen.getByRole("button", { name: /Retry/ })).toBeDisabled();
    submit();
    expect(fixture.port.submit).toHaveBeenCalledOnce();
    expect(screen.getByLabelText(/Message/)).toHaveValue(" A\nmessage ");
  });
  it("blocks idempotency conflict retry and never promises a safe resend", async () => {
    fixture.port.submit.mockResolvedValue({
      kind: "response",
      result: {
        httpStatus: 502,
        body: {
          status: "unknown",
          code: "idempotency_conflict",
          submissionId: id,
        },
      },
    });
    render(<ContactForm available />);
    fill();
    submit();
    await screen.findByText(/cannot be safely completed/);
    submit();
    expect(fixture.port.submit).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: /Retry/ })).toBeDisabled();
  });
  it("recognizes rate limiting, applies bounded cooldown and then preserves manual identity", async () => {
    vi.useFakeTimers();
    fixture.port.submit.mockResolvedValue({
      kind: "response",
      result: {
        httpStatus: 429,
        body: {
          status: "rate_limited",
          code: "rate_limited",
          submissionId: id,
          retryAfterSeconds: 1,
        },
      },
    });
    render(<ContactForm available />);
    fill();
    await act(async () => submit());
    expect(screen.getByText(/Too many attempts/)).toHaveFocus();
    submit();
    expect(fixture.port.submit).toHaveBeenCalledOnce();
    fixture.clock = 1000;
    await act(async () => vi.advanceTimersByTime(1000));
    await act(async () => submit());
    expect(fixture.port.submit).toHaveBeenCalledTimes(2);
    expect(fixture.port.submit.mock.calls[1][0]).toEqual(
      fixture.port.submit.mock.calls[0][0],
    );
  });
  it.each(["configuration", "rate_limit"] as const)(
    "keeps %s recovery guidance and blockers after editing without reusing identity",
    async (kind) => {
      vi.useFakeTimers();
      fixture.port.submit.mockResolvedValue({
        kind: "response",
        result:
          kind === "configuration"
            ? {
                httpStatus: 503,
                body: {
                  status: "unavailable",
                  code: "configuration_unavailable",
                  submissionId: id,
                },
              }
            : {
                httpStatus: 429,
                body: {
                  status: "rate_limited",
                  code: "rate_limited",
                  submissionId: id,
                  retryAfterSeconds: 1,
                },
              },
      });
      render(<ContactForm available />);
      fill();
      await act(async () => submit());
      const copy =
        kind === "configuration"
          ? /form is currently unavailable/
          : /Too many attempts/;
      expect(screen.getByText(copy)).toHaveFocus();
      for (const [label, value] of [
        [/Name/, "Edited visitor"],
        [/Email/, "edited@example.test"],
        [/Message/, "Edited inquiry"],
      ] as const) {
        const field = screen.getByLabelText(label);
        act(() => field.focus());
        fireEvent.change(field, { target: { value } });
        expect(field).toHaveFocus(); // Keeping guidance must not steal editing focus.
        expect(field).toHaveValue(value);
        expect(screen.getByText(copy)).toBeVisible();
        expect(
          screen.getByRole("button", { name: "Send message" }),
        ).toBeDisabled();
        submit();
        expect(fixture.port.submit).toHaveBeenCalledOnce();
      }
      expect(screen.queryByRole("status")).toBeNull();
      expect(screen.queryByRole("alert")).toBeNull();
      fixture.clock = 1000;
      await act(async () => vi.advanceTimersByTime(1000));
      if (kind === "configuration") {
        expect(
          screen.getByRole("button", { name: "Send message" }),
        ).toBeDisabled();
        expect(screen.getByText(copy)).toBeVisible();
        submit();
        expect(fixture.port.submit).toHaveBeenCalledOnce();
      } else {
        expect(
          screen.getByRole("button", { name: "Send message" }),
        ).toBeEnabled();
        fixture.port.createSubmissionId.mockReturnValue(id2);
        fixture.port.submit.mockResolvedValue({
          kind: "unknown",
          reason: "transport",
        });
        await act(async () => submit());
        expect(fixture.port.submit).toHaveBeenCalledTimes(2);
        expect(fixture.port.submit.mock.calls[1][0]).toEqual({
          name: "Edited visitor",
          email: "edited@example.test",
          message: "Edited inquiry",
          website: "",
          submissionId: id2,
        });
        expect(screen.getByLabelText(/Message/)).toHaveValue("Edited inquiry");
      }
    },
  );
  it("shows only confirmation after acceptance and prevents another submission", async () => {
    accepted();
    render(<ContactForm available />);
    fill();
    submit();
    await screen.findByText(/accepted for delivery/);
    await waitFor(() =>
      expect(
        screen.getByText(/does not confirm mailbox receipt/),
      ).toHaveFocus(),
    );
    for (const label of [/Name/, /Email/, /Message/])
      expect(screen.queryByLabelText(label)).toBeNull();
    expect(screen.queryByRole("button", { name: /send/i })).toBeNull();
    submit();
    expect(fixture.port.submit).toHaveBeenCalledOnce();
  });
  it("shows only confirmation after an edited uncertain attempt is accepted", async () => {
    render(<ContactForm available />);
    fill();
    submit();
    await screen.findByText(/couldn’t confirm delivery/);
    fireEvent.change(screen.getByLabelText(/Message/), {
      target: { value: "A new message" },
    });
    expect(screen.getByText(/Editing creates a new message/)).toBeVisible();
    accepted();
    submit();
    await screen.findByText(/accepted for delivery/);
    expect(screen.queryByText(/Editing creates a new message/)).toBeNull();
    expect(screen.queryByLabelText(/Message/)).toBeNull();
  });
  it("does not accept a fake adapter's mismatched identifier", async () => {
    fixture.port.submit.mockResolvedValue({
      kind: "response",
      result: {
        httpStatus: 202,
        body: { status: "accepted", submissionId: id2 },
      },
    });
    render(<ContactForm available />);
    fill();
    submit();
    await screen.findByText(/couldn’t confirm delivery/);
    expect(screen.queryByText(/accepted for delivery/)).toBeNull();
  });
  it("rejects a bot-populated hidden trap before any network effect", () => {
    render(<ContactForm available />);
    fill();
    fireEvent.change(document.querySelector('input[name="website"]')!, {
      target: { value: " " },
    });
    submit();
    expect(fixture.port.submit).not.toHaveBeenCalled();
    expect(screen.getByText(/request was rejected/)).toHaveFocus();
  });
  it("aborts on unmount and never updates a discarded page", async () => {
    fixture.port.submit.mockImplementation(() => new Promise(() => {}));
    const view = render(<ContactForm available />);
    fill();
    submit();
    const signal = fixture.port.submit.mock.calls[0][1];
    view.unmount();
    expect(signal.aborted).toBe(true);
  });
});
