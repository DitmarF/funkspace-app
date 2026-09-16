import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Text from "../Base/Text";
import Button from "./Button";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import InlineStatus from "./InlineStatus";

type FixtureState = "normal" | "invalid" | "disabled" | "pending";
function FormFieldsExample({
  initialState = "normal",
}: {
  initialState?: FixtureState;
}) {
  const [state, setState] = useState<FixtureState>(initialState);
  const [name, setName] = useState("Alex");
  const [email, setEmail] = useState("alex@example.test");
  const [message, setMessage] = useState("A local example message.");
  const [snapshot, setSnapshot] = useState("");
  const [status, setStatus] = useState(
    initialState === "pending"
      ? "Fixture: preview is pending. Nothing is being sent."
      : "",
  );
  const disabled = state === "disabled";
  const pending = state === "pending";
  const select = (next: FixtureState) => {
    setState(next);
    setStatus(
      next === "pending"
        ? "Fixture: preview is pending. Nothing is being sent."
        : `Fixture: ${next} presentation.`,
    );
  };
  return (
    <div className="grid max-w-xl gap-fs-lg">
      <div>
        <h2>Controlled form field examples</h2>
        <Text size="sm">
          Storybook fixture only. No validation service or delivery. All fields
          are optional here.
        </Text>
      </div>
      <div
        className="flex flex-wrap gap-fs-md"
        aria-label="Fixture presentation"
      >
        {(["normal", "invalid", "disabled", "pending"] as const).map((next) => (
          <Button key={next} variant="outlined" onClick={() => select(next)}>
            {next}
          </Button>
        ))}
      </div>
      <form
        className="grid gap-fs-lg"
        noValidate
        onSubmit={(event) => event.preventDefault()}
      >
        <TextField
          label="Name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={disabled}
          readOnly={pending}
          help="Use the name you want displayed in this example."
          error={
            state === "invalid"
              ? "Example name error supplied by the caller."
              : undefined
          }
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={disabled}
          readOnly={pending}
          help="Example address only; no message will be sent."
          error={
            state === "invalid"
              ? "Example email error supplied by the caller."
              : undefined
          }
        />
        <TextAreaField
          label="Message"
          name="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={disabled}
          readOnly={pending}
          help="Resize vertically for more space."
          error={
            state === "invalid"
              ? "Example message error supplied by the caller."
              : undefined
          }
        />
        <InlineStatus message={status} />
        <Button
          variant="outlined"
          onClick={(event) => {
            const form = event.currentTarget.form;
            if (form)
              setSnapshot(
                JSON.stringify(Object.fromEntries(new FormData(form))),
              );
          }}
        >
          Inspect local values
        </Button>
        <Text size="sm">
          Native FormData snapshot:{" "}
          <span data-testid="snapshot">{snapshot || "Not inspected"}</span>
        </Text>
        <Text size="sm">
          Disabled fields keep their values but are omitted from FormData. This
          pending fixture uses read-only fields to retain submission data.
        </Text>
      </form>
    </div>
  );
}

const meta = {
  title: "Controls/FormFields",
  component: FormFieldsExample,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Native fields with caller-supplied help/errors and a separate polite status. Fixture state does not define validation timing, required business fields or a server response contract.",
      },
    },
  },
} satisfies Meta<typeof FormFieldsExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Normal: Story = { args: { initialState: "normal" } };
export const Invalid: Story = { args: { initialState: "invalid" } };
export const Disabled: Story = { args: { initialState: "disabled" } };
export const Pending: Story = { args: { initialState: "pending" } };

export const NativeAndRequired: Story = {
  render: () => (
    <form
      className="grid max-w-xl gap-fs-lg"
      onSubmit={(event) => event.preventDefault()}
    >
      <Text size="sm">
        Required is selected by this fixture, not by the primitives.
      </Text>
      <TextField
        label="Example required text"
        name="example"
        required
        autoComplete="off"
        defaultValue="Uncontrolled value"
        help="A persistent label and explicit required wording."
      />
      <TextAreaField
        label="Optional notes"
        name="notes"
        defaultValue="Native textarea"
        rows={2}
        cols={32}
      />
      <Button type="reset" variant="outlined">
        Reset local values
      </Button>
    </form>
  ),
};

export const DescriptionAssociations: Story = {
  render: () => (
    <div className="grid max-w-xl gap-fs-lg">
      <Text id="external-field-help" size="sm">
        Caller-provided description.
      </Text>
      <TextField
        label="First example"
        help="Local help."
        error="Caller-supplied error."
        aria-describedby="external-field-help"
      />
      <TextField label="Second example" help="Separate local help." />
      <TextAreaField
        label="Notes example"
        help="Separate textarea help."
        error="Caller-supplied notes error."
        aria-describedby="external-field-help"
      />
    </div>
  ),
};

export const SurfacePairings: Story = {
  render: () => (
    <div className="grid gap-fs-lg">
      {(["background", "elevation-1"] as const).map((surface) => (
        <section
          key={surface}
          aria-label={surface}
          className="grid max-w-xl gap-fs-lg p-fs-md"
          style={{ background: `var(--fs-color-surface-${surface})` }}
        >
          <TextField
            label="Normal field"
            defaultValue="Readable value"
            help="Field help text."
            placeholder="Optional placeholder"
          />
          <TextField
            label="Invalid field"
            defaultValue="Retained value"
            error="A readable caller-supplied error."
          />
          <TextField
            label="Disabled field"
            defaultValue="Retained disabled value"
            disabled
          />
          <TextField
            label="Read-only field"
            defaultValue="Retained read-only value"
            readOnly
          />
          <InlineStatus message="Fixture: a nonurgent status update." />
        </section>
      ))}
    </div>
  ),
};
