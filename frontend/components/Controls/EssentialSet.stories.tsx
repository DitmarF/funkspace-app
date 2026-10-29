import type { Meta, StoryObj } from "@storybook/react";
import { StrictMode, useEffect, useId, useRef, useState } from "react";
import { useServices } from "../../application/providers/ServiceProvider";
import Button from "./Button";
import ButtonLink from "./ButtonLink";
import HexButton from "./HexButton";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import InlineStatus from "./InlineStatus";
import Dialog from "./Dialog";
import { Icon } from "../Icons/Icon";
import styles from "./EssentialSet.stories.module.css";

// This is a local acceptance fixture, not a contact form or delivery controller.
function EssentialSet({ fullDocument = false }: { fullDocument?: boolean }) {
  const { themeService } = useServices();
  const [theme, setTheme] = useState(themeService.getCurrentTheme());
  useEffect(
    () => themeService.subscribe((state) => setTheme(state.resolvedTheme)),
    [themeService],
  );
  const [name, setName] = useState("Alex");
  const [email, setEmail] = useState("alex@example.test");
  const [message, setMessage] = useState("A local example to review together.");
  const [invalid, setInvalid] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [runs, setRuns] = useState(0);
  const [status, setStatus] = useState("");
  const fallback = useRef<HTMLHeadingElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const callerHelp = useId();
  return (
    <main className={styles.fixture}>
      <h1 ref={fallback} tabIndex={-1} className={styles.heading}>
        Essential components together
      </h1>
      <p>Local Storybook example. No information is sent or saved.</p>
      <p data-testid="resolved-theme">Resolved theme: {theme}</p>
      <nav className={styles.row} aria-label="Fixture links">
        <ButtonLink href="#fixture-notes">Read fixture notes</ButtonLink>
        <ButtonLink
          href="/iframe.html?id=controls-formfields--normal&viewMode=story"
          target="_blank"
          rel="noreferrer"
        >
          Open field examples in a new tab
        </ButtonLink>
      </nav>
      {fullDocument && (
        <div className={styles.spacer}>Scroll to the controls.</div>
      )}
      <section className={styles.fields} aria-label="Example details">
        <p id={callerHelp}>Keep these example values while reviewing states.</p>
        <TextField
          label="Name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          help="An optional display name for this fixture."
          aria-describedby={callerHelp}
          error={invalid ? "Example caller-supplied name error." : undefined}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          help="Example only; no delivery takes place."
        />
        <TextAreaField
          label="Message"
          name="message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={4}
          help="Resize vertically or use a longer message."
        />
        <label className={styles.row}>
          <input
            type="checkbox"
            checked={invalid}
            onChange={(event) => setInvalid(event.target.checked)}
          />
          Show an example field error
        </label>
      </section>
      <div className={styles.row}>
        <Button
          leadingIcon={<Icon name="arrow-right" />}
          onClick={(event) => {
            trigger.current = event.currentTarget;
            setOpen(true);
          }}
        >
          Review example details
        </Button>
        <HexButton
          onClick={(event) => {
            trigger.current = event.currentTarget;
            setOpen(true);
          }}
        />
        <Button variant="secondary" disabled>
          Unavailable example
        </Button>
      </div>
      <Dialog
        title="Review the example"
        open={open}
        onCloseRequest={() => setOpen(false)}
        returnFocusRef={trigger}
        fallbackFocusRef={fallback}
      >
        <p>Local preview for {name}. This is not evidence of delivery.</p>
        <TextAreaField
          label="Preview message"
          name="preview-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          readOnly={pending}
          rows={4}
          help="Edits are retained when this dialog closes. Pending keeps the value readable."
        />
        <div className={styles.row}>
          <Button
            pending={pending}
            onClick={() => {
              setPending(true);
              setStatus("");
              setRuns((value) => value + 1);
            }}
          >
            Run local preview
          </Button>
          <Button
            variant="outlined"
            disabled={!pending}
            onClick={() => {
              setPending(false);
              setStatus("Fixture complete. Nothing was sent.");
            }}
          >
            Finish fixture work
          </Button>
        </div>
        <p data-testid="fixture-runs">Fixture runs: {runs}</p>
        <InlineStatus message={status} />
        {fullDocument &&
          Array.from({ length: 8 }, (_, index) => (
            <section key={index}>
              <h3 className={styles.subheading}>Review note {index + 1}</h3>
              <p>
                Long content stays inside the dialog. Its header keeps the Close
                control available while these example notes scroll.
              </p>
            </section>
          ))}
      </Dialog>
      <section
        id="fixture-notes"
        tabIndex={-1}
        className={fullDocument ? styles.destination : styles.fields}
      >
        <h2 className={styles.subheading}>Fixture notes</h2>
        <p>
          Use both triggers, edit the message, show an error, and finish the
          local pending state. Close and Escape return to the opening control.
        </p>
      </section>
    </main>
  );
}

const meta = {
  title: "Controls/EssentialSet",
  component: EssentialSet,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <StrictMode>
        <Story />
      </StrictMode>
    ),
  ],
} satisfies Meta<typeof EssentialSet>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Composition: Story = {};
export const FullDocument: Story = { args: { fullDocument: true } };
