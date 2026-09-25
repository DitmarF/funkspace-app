"use client";

import { useEffect, useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { usePathname } from "next/navigation";
import Dialog from "../Controls/Dialog";
import HexButton from "../Controls/HexButton";
import ThemeSwitcher from "../ThemeSwitcher";
import PortfolioNavigationTree from "./PortfolioNavigationTree";
import MotionChoices, { type MotionChoicesProps } from "./MotionChoices";
import styles from "./PortfolioShell.module.css";
import panel from "./PortfolioNavigation.module.css";

export interface PortfolioNavigationProps {
  /** Story/test input only until FS-3.4/3.5 supplies the live policy. */
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
  const pathname = usePathname();
  useEffect(() => setReady(true), []);

  if (!ready) return <PortfolioNavigationTree />;

  return (
    <>
      <div className={`${styles.launcher} ${panel.trigger}`}>
        <HexButton
          ref={triggerRef}
          aria-label="Menu: navigation and settings"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => {
            setCategory("navigation");
            setOpen(true);
          }}
        />
      </div>
      {open && (
        <Dialog
          open={open}
          title="Navigation and settings"
          hideTitle
          presentation="fullscreen"
          className={panel.overlay}
          onCloseRequest={() => setOpen(false)}
          returnFocusRef={triggerRef}
          fallbackFocusRef={triggerRef}
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
                  onNavigate={(href) => {
                    // Same-page links need an unlocked document before scrolling.
                    // Cross-page links keep the overlay until the old shell unmounts.
                    if (href.split("#")[0] === pathname)
                      flushSync(() => setOpen(false));
                  }}
                />
              ) : (
                <>
                  <fieldset className={panel.group}>
                    <legend>Appearance</legend>
                    <ThemeSwitcher presentation="outlined" />
                  </fieldset>
                  {motion && <MotionChoices {...motion} />}
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
              onClick={() => setOpen(false)}
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
