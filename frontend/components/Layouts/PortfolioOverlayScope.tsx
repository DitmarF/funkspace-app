"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";
import { useServices } from "@/application/providers/ServiceProvider";
import type { DialogCloseDisposition } from "@/domain/ports/DialogBindingPort";

type Owner = "navigation" | "customization";
type State = {
  owner: Owner | "none";
  open: boolean;
  next: Owner | "none";
  navigationReady: boolean;
};
type Coordination = State & {
  closeDispositionRef: RefObject<DialogCloseDisposition>;
  request(owner: Owner): boolean;
  close(owner: Owner): void;
  released(owner: Owner): void;
  setNavigationReady(ready: boolean): void;
};
const Context = createContext<Coordination | undefined>(undefined);
export const usePortfolioOverlays = () => useContext(Context);

/** Only the details shell's two known consumers. Dialog owns focus and locks. */
export default function PortfolioOverlayScope({
  children,
}: {
  children: ReactNode;
}) {
  const { navigationHandoff } = useServices();
  const [state, setState] = useState<State>({
    owner: "none",
    open: false,
    next: "none",
    navigationReady: false,
  });
  const current = useRef(state);
  const closeDispositionRef = useRef<DialogCloseDisposition>("dismiss");
  const live = useRef(false);
  const actions = useMemo(() => {
    const update = (patch: Partial<State>) => {
      if (!live.current) return;
      const next = { ...current.current, ...patch };
      if (
        Object.keys(patch).every(
          (key) =>
            next[key as keyof State] === current.current[key as keyof State],
        )
      )
        return;
      current.current = next;
      setState(next);
    };
    return {
      request(owner: Owner) {
        if (!live.current || !current.current.navigationReady) return false;
        closeDispositionRef.current = "dismiss";
        if (current.current.owner === "none")
          update({ owner, open: true, next: "none" });
        else if (current.current.owner !== owner || !current.current.open)
          update({ open: false, next: owner });
        return true;
      },
      close(owner: Owner) {
        if (current.current.owner === owner)
          update({ open: false, next: "none" });
      },
      released(owner: Owner) {
        // Ignore late/duplicate releases and keep the previous owner until closed.
        if (current.current.owner !== owner || current.current.open) return;
        const next = current.current.navigationReady
          ? current.current.next
          : "none";
        update({ owner: next, open: next !== "none", next: "none" });
      },
      setNavigationReady(navigationReady: boolean) {
        update(
          navigationReady
            ? { navigationReady }
            : { navigationReady, open: false, next: "none" },
        );
      },
      depart() {
        closeDispositionRef.current = "navigation";
        update({ open: false, next: "none" });
      },
    };
  }, []);
  useLayoutEffect(() => {
    live.current = true;
    const release = navigationHandoff.observeDeparture(() =>
      flushSync(actions.depart),
    );
    return () => {
      live.current = false;
      closeDispositionRef.current = "navigation";
      current.current = { ...current.current, open: false, next: "none" };
      release();
    };
  }, [navigationHandoff, actions]);
  return (
    <Context.Provider value={{ ...state, ...actions, closeDispositionRef }}>
      {children}
    </Context.Provider>
  );
}
