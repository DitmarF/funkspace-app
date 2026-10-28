"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { useServices } from "@/application/providers/ServiceProvider";
import {
  CONTACT_LIMITS,
  type ContactFieldErrors,
  type ContactRequest,
  type ContactResponse,
} from "@/domain/contact/ContactContract";
import { validateContactRequest } from "@/domain/contact/ContactValidation";
import { parseContactBrowserResponse } from "@/domain/contact/ContactBrowserResponse";
import TextField from "@/components/Controls/TextField";
import TextAreaField from "@/components/Controls/TextAreaField";
import Button from "@/components/Controls/Button";
import styles from "./ContactForm.module.css";

type Field = "name" | "email" | "message";
type Attempt = { payload: ContactRequest; started: number; uncertain: boolean };
const empty = { name: "", email: "", message: "" };
const fieldCopy = (
  field: Field,
  code: string | undefined,
): string | undefined => {
  if (!code) return;
  if (code === "required")
    return field === "email" ? "Enter your email address." : "Enter a message.";
  if (code === "invalid_email")
    return "Enter one email address, such as name@example.com.";
  if (code === "too_long")
    return `${field === "name" ? "Name" : field === "email" ? "Email" : "Message"} is too long (maximum ${field === "name" ? 100 : field === "email" ? 254 : 5000} characters).`;
  return "Remove unsupported control characters from this field.";
};

function resultCopy(result: ContactResponse): string {
  switch (result.status) {
    case "accepted":
      return "Your message was accepted for delivery. Thank you. Acceptance does not confirm mailbox receipt.";
    case "invalid":
      return "Please check the highlighted fields. Your text is still here.";
    case "rate_limited":
      return "Too many attempts. Please wait up to 10 minutes, or contact me by email. Your text is still here.";
    case "unavailable":
      return "The form is currently unavailable. Your text is still here. You can contact me by email.";
    case "failed":
      return "Your message could not be sent. Your text is still here. You can retry or contact me by email.";
    case "rejected":
      return "The request was rejected. Your text is still here. Please contact me by email.";
    case "unknown":
      return result.code === "idempotency_conflict"
        ? "We couldn’t confirm delivery. An earlier message may have been sent. This retry cannot be safely completed; please contact me by email."
        : "We couldn’t confirm delivery. Your message may have been sent. Retry the same message or contact me by email.";
  }
}

/** Availability is a safe server boolean; no configuration reaches the client. */
export default function ContactForm({ available }: { available: boolean }) {
  const { contactSubmission: port } = useServices();
  const [hydrated, setHydrated] = useState(false);
  const ready = hydrated && available;
  const availabilityId = useId();
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [feedback, setFeedback] = useState<ContactResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expired, setExpired] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [deliveryUnavailable, setDeliveryUnavailable] = useState(false);
  const [editedUncertain, setEditedUncertain] = useState(false);
  const attempt = useRef<Attempt | null>(null);
  const busy = useRef(false);
  const mounted = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const message = useRef<HTMLTextAreaElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const result = useRef<HTMLParagraphElement>(null);
  const focus = useRef<Field | "result" | null>(null);

  useEffect(() => {
    mounted.current = true;
    setHydrated(true);
    return () => {
      mounted.current = false;
      controller.current?.abort();
    };
  }, []);
  useEffect(() => {
    const current = attempt.current;
    if (!current || feedback?.status === "accepted") return;
    const remaining =
      CONTACT_LIMITS.sameSubmissionRetryMs - (port.now() - current.started);
    if (remaining <= 0) {
      setExpired(true);
      return;
    }
    const checkExpiry = () => {
      if (port.now() - current.started >= CONTACT_LIMITS.sameSubmissionRetryMs)
        setExpired(true);
    };
    const timer = setTimeout(checkExpiry, remaining);
    window.addEventListener("focus", checkExpiry);
    document.addEventListener("visibilitychange", checkExpiry);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", checkExpiry);
      document.removeEventListener("visibilitychange", checkExpiry);
    };
  }, [generation, port, feedback?.status]);
  useEffect(() => {
    if (retryAt === null) return;
    const timer = setTimeout(
      () => setRetryAt(null),
      Math.max(0, retryAt - port.now()),
    );
    return () => clearTimeout(timer);
  }, [retryAt, port]);
  useEffect(() => {
    if (submitting || !focus.current) return;
    const target =
      focus.current === "result"
        ? result
        : focus.current === "name"
          ? name
          : focus.current === "email"
            ? email
            : message;
    target.current?.focus();
    focus.current = null;
  }, [errors, feedback, submitting, generation]);

  const accepted = feedback?.status === "accepted";
  const conflict =
    feedback?.status === "unknown" && feedback.code === "idempotency_conflict";
  const blocked =
    !ready ||
    submitting ||
    accepted ||
    expired ||
    retryAt !== null ||
    conflict ||
    deliveryUnavailable;

  const edit = (field: Field, value: string) => {
    if (!ready || busy.current || accepted) return;
    if (attempt.current?.uncertain) setEditedUncertain(true);
    attempt.current = null; // Editing retires identity even if text is later restored.
    setGeneration((old) => old + 1);
    setExpired(false);
    // Editing retires the attempt, not configuration or cooldown blockers.
    if (!deliveryUnavailable && retryAt === null) setFeedback(null);
    setErrors((old) => ({ ...old, [field]: undefined }));
    setValues((old) => ({ ...old, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      !hydrated ||
      !available ||
      busy.current ||
      accepted ||
      conflict ||
      deliveryUnavailable ||
      (retryAt !== null && port.now() < retryAt)
    )
      return;
    const previous = attempt.current;
    if (
      previous &&
      port.now() - previous.started >= CONTACT_LIMITS.sameSubmissionRetryMs
    ) {
      setExpired(true);
      focus.current = "result";
      setFeedback({
        status: "unknown",
        code: "delivery_uncertain",
        submissionId: previous.payload.submissionId,
      });
      return;
    }
    const validation = validateContactRequest({
      ...values,
      website: trap.current?.value ?? "",
      submissionId: previous?.payload.submissionId ?? port.createSubmissionId(),
    });
    if (!validation.valid) {
      const body = validation.result.body;
      const fields = body.status === "invalid" ? body.fieldErrors : {};
      setErrors(fields);
      focus.current =
        (["name", "email", "message"] as const).find(
          (field) => fields[field],
        ) ?? "result";
      setFeedback(body);
      return;
    }
    const current = previous ?? {
      payload: validation.value,
      started: port.now(),
      uncertain: false,
    };
    attempt.current = current;
    setGeneration((old) => old + 1);
    busy.current = true;
    setSubmitting(true);
    setErrors({});
    setFeedback(null);
    const abort = new AbortController();
    controller.current = abort;
    let response: ContactResponse;
    try {
      const submission = await port.submit(current.payload, abort.signal);
      const checked =
        submission.kind === "response"
          ? parseContactBrowserResponse(
              submission.result.httpStatus,
              submission.result.body,
              current.payload.submissionId,
            )
          : null;
      response = checked?.body ?? {
        status: "unknown",
        code: "delivery_uncertain",
        submissionId: current.payload.submissionId,
      };
    } catch {
      response = {
        status: "unknown",
        code: "delivery_uncertain",
        submissionId: current.payload.submissionId,
      };
    } finally {
      busy.current = false;
      if (controller.current === abort) controller.current = null;
    }
    if (!mounted.current) return;
    if (response.status === "unknown") current.uncertain = true;
    if (response.status === "accepted") setExpired(false);
    if (response.status === "invalid") {
      setErrors(response.fieldErrors);
      focus.current =
        (["name", "email", "message"] as const).find(
          (field) => response.fieldErrors[field],
        ) ?? "result";
    } else focus.current = "result";
    if (response.status === "rate_limited")
      setRetryAt(port.now() + (response.retryAfterSeconds ?? 600) * 1000);
    if (
      response.status === "unavailable" &&
      response.code === "configuration_unavailable"
    )
      setDeliveryUnavailable(true);
    setFeedback(response);
    setSubmitting(false);
  };

  const another = (event: MouseEvent<HTMLButtonElement>) => {
    // React may reuse this DOM button for the next submit control during click.
    // Cancel the original activation before clearing the accepted snapshot.
    event.preventDefault();
    attempt.current = null;
    setGeneration((old) => old + 1);
    setValues(empty);
    setErrors({});
    setFeedback(null);
    setExpired(false);
    setEditedUncertain(false);
    if (trap.current) trap.current.value = "";
    focus.current = "name";
  };

  // Keep the same visible, disabled fields in SSR and before hydration.
  return (
    <form
      aria-label="Contact inquiry"
      aria-describedby={!ready ? availabilityId : undefined}
      noValidate
      onSubmit={submit}
      className={styles.form}
    >
      {!ready && (
        <p id={availabilityId} className="text-portfolio-body">
          Sending is currently disabled. Please contact me by email.
        </p>
      )}
      <TextField
        ref={name}
        name="name"
        label="Name"
        autoComplete="name"
        value={values.name}
        disabled={!ready}
        readOnly={submitting || accepted}
        help="Optional. Up to 100 characters."
        error={fieldCopy("name", errors.name)}
        onChange={(e) => edit("name", e.target.value)}
      />
      <TextField
        ref={email}
        name="email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={values.email}
        disabled={!ready}
        readOnly={submitting || accepted}
        help="One address where I can reply. Up to 254 characters."
        error={fieldCopy("email", errors.email)}
        onChange={(e) => edit("email", e.target.value)}
      />
      <TextAreaField
        ref={message}
        name="message"
        label="Message"
        required
        rows={6}
        value={values.message}
        disabled={!ready}
        readOnly={submitting || accepted}
        help="General inquiries. Up to 5,000 characters."
        error={fieldCopy("message", errors.message)}
        onChange={(e) => edit("message", e.target.value)}
      />
      <input
        ref={trap}
        name="website"
        type="text"
        defaultValue=""
        hidden
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        disabled={!ready}
        readOnly={submitting || accepted}
      />
      {editedUncertain && (
        <p className="text-portfolio-body">
          Editing creates a new message. An earlier attempt may already have
          been sent.
        </p>
      )}
      {(feedback || expired) && (
        <p
          ref={result}
          tabIndex={-1}
          className={`${styles.result} text-portfolio-body`}
        >
          {expired
            ? "The retry window has ended. Your text is still here. Please contact me by email."
            : feedback
              ? resultCopy(feedback)
              : ""}
        </p>
      )}
      {accepted ? (
        <Button onClick={another}>Send another message</Button>
      ) : (
        <Button
          variant="secondary"
          type={ready ? "submit" : "button"}
          disabled={blocked}
        >
          {attempt.current ? "Retry same message" : "Send message"}
        </Button>
      )}
    </form>
  );
}
