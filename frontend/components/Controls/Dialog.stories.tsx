import type { Meta, StoryObj } from "@storybook/react";
import { StrictMode, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Dialog from "./Dialog";
import Button from "./Button";
import HexButton from "./HexButton";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import type { DialogCloseReason } from "@/domain/ports/DialogBindingPort";

function Example({
  long = false,
  fullDocument = false,
  lifecycle = false,
  initiallyOpen = false,
}: {
  long?: boolean;
  fullDocument?: boolean;
  lifecycle?: boolean;
  initiallyOpen?: boolean;
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [mounted, setMounted] = useState(true);
  const [triggers, setTriggers] = useState(true);
  const [requests, setRequests] = useState<DialogCloseReason[]>([]);
  const [fieldFirst, setFieldFirst] = useState(false);
  const [defer, setDefer] = useState(false);
  const [revision, setRevision] = useState(0);
  const fallback = useRef<HTMLHeadingElement>(null);
  const destination = useRef<HTMLHeadingElement>(null);
  const returnTarget = useRef<HTMLElement | null>(null);
  const initial = useRef<HTMLInputElement>(null);
  return (
    <main className="grid gap-fs-lg p-fs-md">
      <h1 ref={fallback} tabIndex={-1}>
        Shared dialog examples
      </h1>
      <p>
        Local component fixture. Close or press Escape to return. Outside clicks
        keep the dialog open.
      </p>
      {fullDocument && (
        <div style={{ height: "70vh" }}>Scroll down to either trigger.</div>
      )}
      <div className="flex flex-wrap items-center gap-fs-lg">
        {triggers && (
          <>
            <Button
              onClick={(event) => {
                returnTarget.current = event.currentTarget;
                setMounted(true);
                setOpen(true);
              }}
            >
              Open dialog
            </Button>
            <HexButton
              onClick={(event) => {
                returnTarget.current = event.currentTarget;
                setMounted(true);
                setOpen(true);
              }}
            />
          </>
        )}
        <Button
          variant="outlined"
          onClick={() => setRevision((value) => value + 1)}
        >
          Background action
        </Button>
      </div>
      <p data-testid="fixture-events">
        Requests: {requests.join(",") || "none"}; background: {revision}
      </p>
      {lifecycle && (
        <label className="flex gap-fs-xs">
          <input
            type="checkbox"
            checked={fieldFirst}
            onChange={(event) => setFieldFirst(event.target.checked)}
          />
          Initially focus the field
        </label>
      )}
      {mounted && (
        <Dialog
          open={open}
          title={
            long
              ? "A longer dialog with readable, scrollable content"
              : "A shared dialog"
          }
          description={
            long ? undefined : "An example of the shared dialog primitive."
          }
          onCloseRequest={(reason) => {
            setRequests((value) => [...value, reason]);
            if (!defer) setOpen(false);
          }}
          fallbackFocusRef={fallback}
          returnFocusRef={returnTarget}
          initialFocusRef={fieldFirst ? initial : undefined}
        >
          <TextField
            ref={initial}
            label="Example name"
            defaultValue="Alex"
            help="This value stays when you close and reopen."
          />
          {lifecycle && (
            <div className="flex flex-wrap gap-fs-md">
              <Button variant="outlined" onClick={() => setOpen(false)}>
                Controlled close
              </Button>
              <Button variant="outlined" onClick={() => setMounted(false)}>
                Unmount dialog
              </Button>
              <Button variant="outlined" onClick={() => setTriggers(false)}>
                Remove triggers
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  returnTarget.current = destination.current;
                  setOpen(false);
                }}
              >
                Focus destination
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  flushSync(() => setOpen(false));
                  setOpen(true);
                }}
              >
                Rapid reopen
              </Button>
              <Button
                variant="outlined"
                onClick={(event) =>
                  event.currentTarget.closest("dialog")?.close()
                }
              >
                Native close
              </Button>
              <label className="flex gap-fs-xs">
                <input
                  type="checkbox"
                  checked={defer}
                  onChange={(event) => setDefer(event.target.checked)}
                />
                Delay fixture acknowledgment
              </label>
            </div>
          )}
          {long &&
            Array.from({ length: 12 }, (_, index) => (
              <section key={index}>
                <h3 className="font-display font-semibold">
                  Example section {index + 1}
                </h3>
                <p>
                  Long content stays inside the dialog. Read at your preferred
                  text size and scroll to the final field. The surrounding page
                  keeps its position when you close.
                </p>
              </section>
            ))}
          <TextAreaField
            label="Example notes"
            defaultValue="No message is sent by this fixture."
            rows={3}
          />
        </Dialog>
      )}
      <h2 ref={destination} tabIndex={-1}>
        Example destination
      </h2>
      {fullDocument && (
        <div style={{ height: "140vh" }}>
          Surrounding document content. The dialog does not lock
          Storybook&apos;s outer interface when embedded.
        </div>
      )}
      <a href="#fixture-end" id="fixture-end">
        Background link
      </a>
    </main>
  );
}

const meta = {
  title: "Controls/Dialog",
  component: Example,
  decorators: [
    (Story) => (
      <StrictMode>
        <Story />
      </StrictMode>
    ),
  ],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Example>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ShortContent: Story = {};
export const LongContent: Story = { args: { long: true } };
export const FullDocument: Story = {
  args: { long: true, fullDocument: true, lifecycle: true },
};
export const Lifecycle: Story = { args: { lifecycle: true } };
export const InitiallyOpen: Story = { args: { initiallyOpen: true } };
