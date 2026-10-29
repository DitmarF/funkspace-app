import type { Meta, StoryObj } from "@storybook/react";
import { useGlobals } from "storybook/preview-api";
import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { ServiceProvider } from "@/application/providers/ServiceProvider";
import { createServices } from "@/infrastructure/services/createServices";
import PortfolioShell from "@/components/Layouts/PortfolioShell";
import Button from "@/components/Controls/Button";
import ButtonLink from "@/components/Controls/ButtonLink";
import { contactEmail, contactHref } from "@/data/contactContent";
import ContactForm from "./ContactForm";
import {
  ManualContactSubmission,
  manualScenarios,
  type ManualScenario,
} from "./manual/ManualContactSubmission";

const themes = [
  ["light", "Light"],
  ["dark", "Dark"],
  ["muted", "Muted"],
  ["highContrast", "High contrast"],
  ["default", "System"],
] as const;
type ThemeControls = { theme: string; changeTheme: (theme: string) => void };
function ManualPreview(props: ThemeControls) {
  const [session, setSession] = useState(0);
  return (
    <ManualSession
      key={session}
      {...props}
      reset={() => setSession((old) => old + 1)}
    />
  );
}
function ManualSession({
  theme,
  changeTheme,
  reset,
}: ThemeControls & { reset: () => void }) {
  const controlsId = useId();
  const [port] = useState(() => new ManualContactSubmission());
  const [factory] = useState(
    () => () =>
      createServices({
        decorativeMotionAvailable: false,
        contactSubmission: port,
      }),
  );
  const [snapshot, setSnapshot] = useState(port.getSnapshot);
  const [scenario, setScenario] = useState<ManualScenario>("accepted");
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    const unsubscribe = port.subscribe(setSnapshot);
    return () => {
      unsubscribe();
      port.dispose();
    };
  }, [port]);
  return (
    <ServiceProvider serviceFactory={factory}>
      <PortfolioShell>
        <div className="max-w-prose space-y-fs-lg break-words">
          <aside
            aria-label="Manual test controls"
            className="space-y-fs-md rounded-fs-md border border-fs-border-default p-fs-md"
          >
            <h2 className="text-xl font-bold">
              Simulated contact test — no email is sent
            </h2>
            <p>
              Use sample text. All responses stay in this page. These controls
              belong to the test preview, not the contact page.
            </p>
            <div className="space-y-fs-xs">
              <label className="block" htmlFor={`${controlsId}-response`}>
                Next response
              </label>
              <select
                id={`${controlsId}-response`}
                className="w-full rounded-fs-sm border border-fs-border-default bg-fs-surface-background p-fs-sm text-fs-content-primary"
                value={scenario}
                disabled={snapshot.active}
                onChange={(event) => {
                  const next = event.target.value as ManualScenario;
                  setScenario(next);
                  port.select(next);
                }}
              >
                {manualScenarios.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-fs-xs">
              <label className="block" htmlFor={`${controlsId}-theme`}>
                Preview theme
              </label>
              <select
                id={`${controlsId}-theme`}
                className="w-full rounded-fs-sm border border-fs-border-default bg-fs-surface-background p-fs-sm text-fs-content-primary"
                value={theme}
                onChange={(event) => changeTheme(event.target.value)}
              >
                {themes.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-fs-sm">
              <input
                type="checkbox"
                checked={disabled}
                disabled={snapshot.active}
                onChange={(event) => setDisabled(event.target.checked)}
              />
              Show delivery-disabled presentation
            </label>
            <div className="flex flex-wrap gap-fs-sm">
              <Button
                disabled={!snapshot.active || scenario !== "held"}
                onClick={() => port.release(true)}
              >
                Release accepted response
              </Button>
              <Button
                disabled={!snapshot.active || scenario !== "held"}
                onClick={() => port.release(false)}
              >
                Release uncertain response
              </Button>
              <Button
                disabled={snapshot.active || snapshot.requests === 0}
                onClick={() => {
                  port.advanceRetryWindow();
                  window.dispatchEvent(new Event("focus"));
                }}
              >
                Advance retry clock by 23 hours
              </Button>
              <Button onClick={reset}>Reset test and clear draft</Button>
            </div>
            <p>
              Choose a response, fill the form, then submit. Changing the
              response or theme preserves the draft and retry ID. Reset
              deliberately clears them. Timeout scenarios take the real 15
              seconds; the 504 scenario simulates an already returned server
              timeout.
            </p>
            <details>
              <summary>Test request and retry evidence</summary>
              <p>
                Simulated requests:{" "}
                <span data-testid="manual-request-count">
                  {snapshot.requests}
                </span>
                . Active exchange: {snapshot.active ? "yes" : "no"}. Clock
                advanced: {snapshot.advancedHours} hours.
              </p>
              <p>
                Last ID:{" "}
                <span data-testid="manual-last-id">
                  {snapshot.lastId ?? "none"}
                </span>
              </p>
              <p>
                Previous ID: {snapshot.previousId ?? "none"}. Fetch aborts:{" "}
                {snapshot.aborts}. Body cancellations:{" "}
                {snapshot.bodyCancellations}.
              </p>
              <p>
                Only request counts and synthetic IDs are shown; no draft
                logging or storage.
              </p>
            </details>
          </aside>
          <article className="space-y-fs-lg">
            <h1 className="text-3xl font-bold">Contact</h1>
            <p className="text-portfolio-body">
              Have a question, an idea, or some feedback? Get in touch.
            </p>
            <p>
              Manual test fixture: acceptance and failures below are simulated.
            </p>
            <ContactForm available={!disabled} />
            <p className="text-portfolio-body">
              You can always contact me by email. Email links open your mail
              application.
            </p>
            <ButtonLink href={contactHref}>{contactEmail}</ButtonLink>
            <p className="text-portfolio-body">
              Read the{" "}
              <Link
                href="/privacy"
                className="text-fs-content-primary underline"
              >
                Privacy information
              </Link>{" "}
              before sharing personal information.
            </p>
            <p>
              Use the real delivery-disabled /contact page for navigation and
              no-JavaScript checks. This Storybook page needs JavaScript.
            </p>
          </article>
        </div>
      </PortfolioShell>
    </ServiceProvider>
  );
}
const meta = {
  title: "Contact/Manual preview",
  parameters: {
    layout: "fullscreen",
    decorativeMotionAvailable: false,
    nextjs: { appDirectory: true, navigation: { pathname: "/contact" } },
  },
  render: function Render() {
    const [globals, updateGlobals] = useGlobals();
    return (
      <ManualPreview
        theme={String(globals.theme ?? "default")}
        changeTheme={(theme) => updateGlobals({ theme })}
      />
    );
  },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Manual: Story = {};
