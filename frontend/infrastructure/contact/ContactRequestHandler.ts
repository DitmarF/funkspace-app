import "server-only";
import { CONTACT_LIMITS } from "@/domain/contact/ContactContract";
import type {
  ContactResult,
  SubmitContact,
} from "@/domain/contact/ContactResult";
import {
  cancelContactBody,
  ContactBodyError,
  readBoundedJson,
} from "./BoundedJson";
import {
  recordContactDiagnostic,
  type ContactDiagnosticWriter,
} from "./ContactDiagnostics";

export function createContactRequestHandler(
  submit: SubmitContact,
  allowedOrigins: readonly string[],
  writeDiagnostic: ContactDiagnosticWriter = () => {},
): (request: Request) => Promise<Response> {
  return async (request) => {
    const finish = (result: ContactResult) => {
      recordContactDiagnostic(result, writeDiagnostic);
      return respond(result);
    };
    const reject = (result: ContactResult) => {
      cancelContactBody(request.body);
      return finish(result);
    };
    if (request.method !== "POST")
      return reject({
        httpStatus: 405,
        body: {
          status: "rejected",
          code: "method_not_allowed",
          submissionId: null,
        },
      });
    const origin = request.headers.get("origin");
    if (!origin || !allowedOrigins.includes(origin))
      return reject({
        httpStatus: 403,
        body: {
          status: "rejected",
          code: "origin_rejected",
          submissionId: null,
        },
      });
    const contentType = request.headers.get("content-type") ?? "";
    const encoding = request.headers.get("content-encoding");
    if (
      !/^application\/json(?:\s*;\s*charset\s*=\s*utf-8)?\s*$/i.test(
        contentType,
      ) ||
      (encoding !== null && encoding.toLowerCase() !== "identity")
    )
      return reject({
        httpStatus: 415,
        body: {
          status: "rejected",
          code: "unsupported_media_type",
          submissionId: null,
        },
      });
    let input: unknown;
    try {
      // Content-Length is deliberately not trusted: count actual streamed bytes.
      input = await readBoundedJson(
        request.body,
        CONTACT_LIMITS.requestBytes,
        request.signal,
      );
    } catch (error) {
      const code =
        error instanceof ContactBodyError ? error.code : "malformed_json";
      return code === "request_too_large"
        ? finish({
            httpStatus: 413,
            body: { status: "rejected", code, submissionId: null },
          })
        : finish({
            httpStatus: 400,
            body: { status: "rejected", code, submissionId: null },
          });
    }
    return finish(await submit(input));
  };
}

function respond(result: ContactResult): Response {
  return Response.json(result.body, {
    status: result.httpStatus,
    headers: {
      "Cache-Control": "no-store",
      ...(result.httpStatus === 405 ? { Allow: "POST" } : {}),
    },
  });
}
