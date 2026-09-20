"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { portfolioDestinations as destinations } from "../../data/portfolioDestinations";
import ButtonLink from "../Controls/ButtonLink";
import Dialog from "../Controls/Dialog";
import HexButton from "../Controls/HexButton";
import ThemeSwitcher from "../ThemeSwitcher";
import styles from "./PortfolioShell.module.css";

/** Progressively enhance ordinary footer links with the shared modal. */
export default function PortfolioNavigation() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setReady(true), []);

  const links = (
    <nav aria-label="Primary">
      <ul className="flex flex-wrap gap-fs-md">
        {[destinations.start, destinations.about].map((destination) => (
          <li key={destination.href}>
            <ButtonLink
              href={destination.href}
              onClick={() => {
                // Release the dialog's scroll lock before the native anchor action.
                flushSync(() => setOpen(false));
              }}
            >
              {destination.label}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </nav>
  );

  if (!ready) return links;

  return (
    <>
      <div className={styles.launcher}>
        <HexButton
          ref={triggerRef}
          aria-label="Menu: navigation and settings"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          {""}
        </HexButton>
      </div>
      {open && (
        <Dialog
          open={open}
          title="Navigation and settings"
          onCloseRequest={() => setOpen(false)}
          returnFocusRef={triggerRef}
          fallbackFocusRef={triggerRef}
        >
          {links}
          <fieldset className="min-w-0 space-y-fs-md">
            <legend className="font-display text-xl font-semibold">
              Appearance
            </legend>
            <ThemeSwitcher />
          </fieldset>
          <nav aria-label="Legal">
            <ButtonLink href={destinations.privacy.href}>
              {destinations.privacy.label}
            </ButtonLink>
          </nav>
        </Dialog>
      )}
    </>
  );
}
