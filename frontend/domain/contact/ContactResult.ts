import type {
  ContactHttpStatus,
  ContactResponseByHttpStatus,
} from "./ContactContract";

/** Keeps each HTTP status paired with its frozen JSON envelope. */
export type ContactResult = {
  [K in ContactHttpStatus]: Readonly<{
    httpStatus: K;
    body: ContactResponseByHttpStatus[K];
  }>;
}[ContactHttpStatus];

export type SubmitContact = (input: unknown) => Promise<ContactResult>;
