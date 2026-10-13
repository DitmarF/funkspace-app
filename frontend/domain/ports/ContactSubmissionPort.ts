import type { ContactRequest } from "../contact/ContactContract";
import type { ContactResult } from "../contact/ContactResult";

export type ContactSubmissionResult =
  | Readonly<{ kind: "response"; result: ContactResult }>
  | Readonly<{
      kind: "unknown";
      reason: "transport" | "invalid_response" | "timeout" | "cancelled";
    }>;

/** Browser effects are supplied by composition; draft state stays in the page. */
export interface ContactSubmissionPort {
  submit(
    request: ContactRequest,
    signal: AbortSignal,
  ): Promise<ContactSubmissionResult>;
  createSubmissionId(): string;
  /** Nondecreasing elapsed time counting sleep; rollback retires old retries. */
  now(): number;
}
