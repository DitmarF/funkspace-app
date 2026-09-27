"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useId,
  useRef,
  useState,
} from "react";
import { flushSync } from "react-dom";
import { useServices } from "@/application/providers/ServiceProvider";
import type { DialogCloseDisposition } from "@/domain/ports/DialogBindingPort";
import { portfolioDestinations } from "@/data/portfolioDestinations";
import Dialog from "../Controls/Dialog";
import HexButton from "../Controls/HexButton";
import ThemeSwitcher from "../ThemeSwitcher";
import PortfolioNavigationTree from "./PortfolioNavigationTree";
import MotionChoices, { type MotionChoicesProps } from "./MotionChoices";
import MotionSettings from "./MotionSettings";
import styles from "./PortfolioShell.module.css";
import panel from "./PortfolioNavigation.module.css";

export interface PortfolioNavigationProps {
  /** Optional controlled story/test fixture; production uses the shared authority. */
  motion?: MotionChoicesProps;
}

/** Progressively enhance ordinary footer links with the shared modal. */
export default function PortfolioNavigation({
  motion,
}: PortfolioNavigationProps) {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<"navigation" | "a11y">("navigation");
  const detailId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { navigationHandoff } = useServices();
  const disposition = useRef<DialogCloseDisposition>("dismiss");
  const ticket = useRef<number | null>(null);
  const [failed, setFailed] = useState(false);
  // Resolve at use time: a route change may replace the old main before cleanup.
  const fallback = useMemo(
    () => ({
      get current() {
        return navigationHandoff.fallbackTarget();
      },
    }),
    [navigationHandoff],
  );
  useLayoutEffect(() => {
    const main = navigationHandoff.fallbackTarget();
    if (main) navigationHandoff.arrived(main);
    return navigationHandoff.observeDeparture(() => {
      disposition.current = "navigation";
      flushSync(() => setOpen(false));
    });
  }, [navigationHandoff]);
  const dismiss = () => {
    navigationHandoff.cancelPreferred();
    disposition.current = "dismiss";
    setOpen(false);
  };
  useEffect(() => setReady(true), []);

  if (!ready || failed)
    return (
      <div data-home-content="">
        <PortfolioNavigationTree />
      </div>
    );

  return (
    <>
      <div data-home-menu="" className={`${styles.launcher} ${panel.trigger}`}>
        <HexButton
          ref={triggerRef}
          aria-label="Menu: navigation and settings"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            navigationHandoff.cancelPreferred();
            ticket.current = null;
            disposition.current = "dismiss";
            setCategory("navigation");
            setOpen(true);
          }}
        />
      </div>
      <Dialog
        open={open}
        title="Navigation and settings"
        hideTitle
        presentation="fullscreen"
        className={panel.overlay}
        onCloseRequest={dismiss}
        closeDispositionRef={disposition}
        unmountDisposition="navigation"
        scrollLock="document-overflow"
        onReleased={() => {
          const id = ticket.current;
          ticket.current = null;
          if (id !== null) navigationHandoff.released(id);
        }}
        onOpenError={(error) => {
          navigationHandoff.cancel();
          setOpen(false);
          setFailed(true);
          console.error(
            "[PortfolioNavigation] Dialog unavailable; ordinary links restored",
            error,
          );
        }}
        returnFocusRef={triggerRef}
        fallbackFocusRef={fallback}
      >
        <div className={panel.layout}>
          <section
            id={detailId}
            aria-labelledby={`${detailId}-title`}
            className={panel.details}
          >
            <h3 id={`${detailId}-title`}>
              {category === "navigation" ? "Navigation" : "Accessibility"}
            </h3>
            {category === "navigation" ? (
              <PortfolioNavigationTree
                onNavigate={(key) => {
                  const next = navigationHandoff.begin(
                    portfolioDestinations[key],
                  );
                  ticket.current = next.id;
                  disposition.current = "navigation";
                  if (next.kind === "same-document")
                    flushSync(() => setOpen(false));
                }}
              />
            ) : (
              <>
                <fieldset className={panel.group}>
                  <legend>Appearance</legend>
                  <ThemeSwitcher presentation="outlined" />
                </fieldset>
                {motion ? <MotionChoices {...motion} /> : <MotionSettings />}
              </>
            )}
          </section>
        </div>
        <div className={`${styles.launcher} ${panel.rail}`}>
          <div
            className={panel.categories}
            role="group"
            aria-label="Settings categories"
          >
            <HexButton
              icon="navigation"
              iconSize={48}
              aria-label="Navigation"
              title="Navigation"
              aria-pressed={category === "navigation"}
              aria-controls={detailId}
              onClick={() => setCategory("navigation")}
            />
            <HexButton
              icon="languages"
              aria-label="Languages"
              title="Languages"
              disabled
            />
            <HexButton
              icon="a11y"
              aria-label="Accessibility"
              title="Accessibility"
              aria-pressed={category === "a11y"}
              aria-controls={detailId}
              onClick={() => setCategory("a11y")}
            />
            <HexButton
              icon="chat-bot"
              aria-label="Chat-bot"
              title="Chat-bot"
              disabled
            />
          </div>
          <HexButton
            variant="accent-outlined"
            aria-label="Menu: close navigation and settings"
            onClick={dismiss}
          />
        </div>
      </Dialog>
    </>
  );
}
