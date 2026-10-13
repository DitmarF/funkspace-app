import {
  CONTACT_LIMITS,
  type ContactFieldErrors,
  type ContactRequest,
} from "./ContactContract";
import type { ContactResult } from "./ContactResult";

declare const validatedContact: unique symbol;
export type ValidatedContactRequest = ContactRequest & {
  readonly [validatedContact]: true;
};

export type ContactValidation =
  | Readonly<{ valid: true; value: ValidatedContactRequest }>
  | Readonly<{ valid: false; result: ContactResult }>;

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const uuidV4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// WHATWG single-address grammar; no lists, display names or quoted local parts.
const emailAddress =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_\x60{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const fields = ["name", "email", "message", "submissionId", "website"] as const;

export function isProviderAcceptanceId(value: unknown): value is string {
  return typeof value === "string" && value.length === 36 && uuid.test(value);
}

function invalidCharacters(value: string, multiline = false): boolean {
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    if (
      (code < 32 && !(multiline && (code === 9 || code === 10))) ||
      (code >= 127 && code <= 159) ||
      (!multiline && (code === 0x2028 || code === 0x2029))
    )
      return true;
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = value.charCodeAt(++i);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return true;
    } else if (code >= 0xdc00 && code <= 0xdfff) return true;
  }
  return false;
}

/** Raw header-safety checks precede trimming, shared by client and server rules. */
export function contactEmailError(raw: string): ContactFieldErrors["email"] {
  if (invalidCharacters(raw)) return "invalid_characters";
  const value = raw.trim();
  if (!value) return "required";
  if (value.length > CONTACT_LIMITS.emailUnits) return "too_long";
  if (!emailAddress.test(value)) return "invalid_email";
}

export function validateContactRequest(input: unknown): ContactValidation {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return shapeError();
  }
  const keys = Reflect.ownKeys(input);
  const descriptors = Object.getOwnPropertyDescriptors(input);
  if (
    keys.length !== fields.length ||
    !fields.every((key) => typeof descriptors[key]?.value === "string")
  )
    return shapeError();
  // Descriptor values avoid executing getters; exact own keys prevent coercion.
  const raw = Object.fromEntries(
    fields.map((key) => [key, descriptors[key].value]),
  ) as Record<(typeof fields)[number], string>;
  if (raw.submissionId.length !== 36 || !uuidV4.test(raw.submissionId)) {
    return {
      valid: false,
      result: {
        httpStatus: 400,
        body: {
          status: "rejected",
          code: "invalid_submission_id",
          submissionId: null,
        },
      },
    };
  }
  const submissionId = raw.submissionId.toLowerCase();
  if (raw.website !== "") {
    return {
      valid: false,
      result: {
        httpStatus: 400,
        body: { status: "rejected", code: "spam_rejected", submissionId },
      },
    };
  }
  const name = raw.name.trim();
  const email = raw.email.trim();
  const message = raw.message.replace(/\r\n?/g, "\n").trim();
  const fieldErrors: {
    -readonly [K in keyof ContactFieldErrors]: ContactFieldErrors[K];
  } = {};
  if (invalidCharacters(raw.name)) fieldErrors.name = "invalid_characters";
  else if (name.length > CONTACT_LIMITS.nameUnits)
    fieldErrors.name = "too_long";
  const emailError = contactEmailError(raw.email);
  if (emailError) fieldErrors.email = emailError;
  // Check before trim so forbidden controls cannot be discarded as whitespace.
  if (invalidCharacters(raw.message.replace(/\r\n?/g, "\n"), true))
    fieldErrors.message = "invalid_characters";
  else if (!message) fieldErrors.message = "required";
  else if (message.length > CONTACT_LIMITS.messageUnits)
    fieldErrors.message = "too_long";
  if (Object.keys(fieldErrors).length) {
    return {
      valid: false,
      result: {
        httpStatus: 422,
        body: {
          status: "invalid",
          code: "validation_failed",
          submissionId,
          fieldErrors,
        },
      },
    };
  }
  return {
    valid: true,
    // The brand is introduced only after all runtime checks above.
    value: Object.freeze({
      name,
      email,
      message,
      submissionId,
      website: "",
    }) as ValidatedContactRequest,
  };
}

function shapeError(): ContactValidation {
  return {
    valid: false,
    result: {
      httpStatus: 400,
      body: { status: "rejected", code: "invalid_shape", submissionId: null },
    },
  };
}
