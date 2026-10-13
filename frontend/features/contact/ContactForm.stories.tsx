import type { Meta, StoryObj } from "@storybook/react";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import { createServices } from "@/infrastructure/services/createServices";
import type { ContactSubmissionPort } from "@/domain/ports/ContactSubmissionPort";
import ContactForm from "./ContactForm";
import ButtonLink from "@/components/Controls/ButtonLink";
import { contactEmail, contactHref } from "@/data/contactContent";

const modes = [
  "accepted",
  "uncertain",
  "rate_limited",
  "unavailable",
  "rejected",
  "field_errors",
  "internal_submitting",
] as const;
type Mode = (typeof modes)[number];
const ports: Readonly<Record<string, ContactSubmissionPort>> =
  Object.fromEntries(
    modes.map((mode) => [
      mode,
      {
        createSubmissionId: () => crypto.randomUUID(),
        now: () => performance.now(),
        submit: async (request) => {
          if (mode === "internal_submitting") return new Promise(() => {});
          if (mode === "uncertain")
            return { kind: "unknown", reason: "transport" };
          if (mode === "accepted")
            return {
              kind: "response",
              result: {
                httpStatus: 202,
                body: {
                  status: "accepted",
                  submissionId: request.submissionId,
                },
              },
            };
          if (mode === "field_errors")
            return {
              kind: "response",
              result: {
                httpStatus: 422,
                body: {
                  status: "invalid",
                  code: "validation_failed",
                  submissionId: request.submissionId,
                  fieldErrors: { email: "invalid_email" },
                },
              },
            };
          if (mode === "rate_limited")
            return {
              kind: "response",
              result: {
                httpStatus: 429,
                body: {
                  status: "rate_limited",
                  code: "rate_limited",
                  submissionId: request.submissionId,
                  retryAfterSeconds: 1,
                },
              },
            };
          return {
            kind: "response",
            result:
              mode === "unavailable"
                ? {
                    httpStatus: 503,
                    body: {
                      status: "unavailable",
                      code: "configuration_unavailable",
                      submissionId: request.submissionId,
                    },
                  }
                : {
                    httpStatus: 403,
                    body: {
                      status: "rejected",
                      code: "origin_rejected",
                      submissionId: request.submissionId,
                    },
                  },
          };
        },
      } satisfies ContactSubmissionPort,
    ]),
  );
const factories: Readonly<
  Record<string, () => ReturnType<typeof createServices>>
> = Object.fromEntries(
  modes.map((mode) => [
    mode,
    () =>
      createServices({
        decorativeMotionAvailable: false,
        contactSubmission: ports[mode],
      }),
  ]),
);

const meta = {
  title: "Contact/ContactForm",
  component: ContactForm,
  args: { available: true },
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-prose space-y-fs-lg">
        <h1 className="text-3xl font-bold">Contact fixture</h1>
        <Story />
        <ButtonLink href={contactHref}>{contactEmail}</ButtonLink>
        <p>
          Controlled responses only; these stories make no mail requests. Fill
          the fields and submit to inspect each outcome.
        </p>
      </div>
    ),
  ],
} satisfies Meta<typeof ContactForm>;
export default meta;
type Story = StoryObj<typeof meta>;
function story(mode: Mode): Story {
  return {
    decorators: [
      (Story) => (
        <ServiceProvider serviceFactory={factories[mode]}>
          <Story />
        </ServiceProvider>
      ),
    ],
  };
}
export const Accepted = story("accepted");
export const Uncertain = story("uncertain");
export const RateLimited = story("rate_limited");
export const Unavailable = story("unavailable");
export const Rejected = story("rejected");
export const FieldErrors = story("field_errors");
export const InternalSubmitting = story("internal_submitting");
export const DeliveryDisabled: Story = { args: { available: false } };
