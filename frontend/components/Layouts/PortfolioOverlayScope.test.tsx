import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import PortfolioOverlayScope, {
  usePortfolioOverlays,
} from "./PortfolioOverlayScope";

const service = vi.hoisted(() => ({
  departure: undefined as (() => void) | undefined,
  release: vi.fn(),
}));
vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => ({ navigationHandoff: handoff }),
}));
const handoff = {
  observeDeparture: (cb: () => void) => {
    service.departure = cb;
    return service.release;
  },
};
let controls: NonNullable<ReturnType<typeof usePortfolioOverlays>>;
function Consumer() {
  controls = usePortfolioOverlays()!;
  return <span>{controls.owner}</span>;
}
beforeEach(() => {
  vi.clearAllMocks();
  render(
    <PortfolioOverlayScope>
      <Consumer />
    </PortfolioOverlayScope>,
  );
});
afterEach(cleanup);

it("waits for native navigation handover; only a released owner allows the other modal", () => {
  act(() => {
    expect(controls.request("customization")).toBe(false);
    controls.setNavigationReady(true);
    controls.request("navigation");
  });
  expect(controls).toMatchObject({ owner: "navigation", open: true });
  act(() => controls.request("customization"));
  expect(controls).toMatchObject({
    owner: "navigation",
    open: false,
    next: "customization",
  });
  act(() => controls.released("navigation"));
  expect(controls).toMatchObject({
    owner: "customization",
    open: true,
    next: "none",
  });
  act(() => controls.released("navigation"));
  expect(controls).toMatchObject({ owner: "customization", open: true });
});

it("keeps only the last request and ignores releases from an open or stale owner", () => {
  act(() => {
    controls.setNavigationReady(true);
    controls.request("customization");
  });
  act(() => {
    controls.request("navigation");
    controls.request("customization");
  });
  expect(controls).toMatchObject({
    owner: "customization",
    open: false,
    next: "customization",
  });
  act(() => controls.released("customization"));
  expect(controls).toMatchObject({ owner: "customization", open: true });
  act(() => controls.released("customization"));
  expect(controls.open).toBe(true);
});

it("departure invalidates queued opens and marks both consumers navigation before release", () => {
  act(() => {
    controls.setNavigationReady(true);
    controls.request("customization");
  });
  act(() => controls.request("navigation"));
  act(() => service.departure!());
  expect(controls.closeDispositionRef.current).toBe("navigation");
  expect(controls.next).toBe("none");
  act(() => controls.released("customization"));
  expect(controls.owner).toBe("none");
  act(() => controls.request("navigation"));
  expect(controls.closeDispositionRef.current).toBe("dismiss");
});

it("failed navigation readiness cancels queued work without claiming lock release", () => {
  act(() => {
    controls.setNavigationReady(true);
    controls.request("customization");
    controls.request("navigation");
  });
  act(() => controls.setNavigationReady(false));
  expect(controls).toMatchObject({
    owner: "customization",
    open: false,
    next: "none",
  });
  act(() => controls.released("customization"));
  expect(controls.owner).toBe("none");
  act(() => expect(controls.request("customization")).toBe(false));
});

it("dismiss cancels a queued transition and opening canceled before native acquisition can release", () => {
  act(() => {
    controls.setNavigationReady(true);
    controls.request("navigation");
    controls.close("navigation");
  });
  expect(controls).toMatchObject({ owner: "navigation", open: false });
  act(() => controls.released("navigation"));
  expect(controls.owner).toBe("none");
});

it("unmount invalidates retained callbacks and cancels the departure subscription", () => {
  act(() => {
    controls.setNavigationReady(true);
    controls.request("customization");
  });
  const old = controls;
  cleanup();
  expect(service.release).toHaveBeenCalledOnce();
  expect(old.closeDispositionRef.current).toBe("navigation");
  expect(old.request("navigation")).toBe(false);
  old.released("customization");
});
