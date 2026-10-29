import "server-only";
import { contactEmailError } from "@/domain/contact/ContactValidation";

export type ContactEnvironment = Readonly<{
  CONTACT_ENABLED?: string;
  CONTACT_ALLOWED_ORIGINS?: string;
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
}>;

export type ResendContactConfiguration = Readonly<{
  apiKey: string;
  from: string;
  to: string;
}>;

export function readAllowedContactOrigins(
  value: string | undefined,
): readonly string[] {
  try {
    const origins: unknown = JSON.parse(value ?? "");
    if (!Array.isArray(origins) || !origins.length) return [];
    if (
      !origins.every((origin: unknown) => {
        if (typeof origin !== "string") return false;
        const url = new URL(origin);
        const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(
          url.hostname,
        );
        return (
          !url.hostname.includes("*") &&
          url.origin === origin &&
          (url.protocol === "https:" || (url.protocol === "http:" && loopback))
        );
      })
    )
      return [];
    return Object.freeze([...new Set<string>(origins)]);
  } catch {
    return [];
  }
}

export function readContactConfiguration(environment: ContactEnvironment): {
  allowedOrigins: readonly string[];
  delivery: ResendContactConfiguration | null;
} {
  const allowedOrigins = readAllowedContactOrigins(
    environment.CONTACT_ALLOWED_ORIGINS,
  );
  // Disabled/invalid-origin setup never reads the API credential or mail identities.
  if (environment.CONTACT_ENABLED !== "true" || !allowedOrigins.length) {
    return { allowedOrigins, delivery: null };
  }
  const apiKey = environment.RESEND_API_KEY;
  const from = environment.CONTACT_FROM;
  const to = environment.CONTACT_TO;
  const sender = from?.match(/^FunkSpace <([^<>]+)>$/)?.[1];
  if (
    !apiKey ||
    apiKey !== apiKey.trim() ||
    !/^re_[A-Za-z0-9_-]+$/.test(apiKey) ||
    !from ||
    from !== from.trim() ||
    !sender ||
    sender !== sender.trim() ||
    contactEmailError(sender) ||
    !to ||
    to !== to.trim() ||
    contactEmailError(to)
  )
    return { allowedOrigins, delivery: null };
  return { allowedOrigins, delivery: Object.freeze({ apiKey, from, to }) };
}
