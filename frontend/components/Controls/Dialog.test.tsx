import { render, screen, fireEvent } from "@testing-library/react";
import { StrictMode, createRef } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dialog from "./Dialog";
import type { DialogBindingOptions } from "@/domain/ports/DialogBindingPort";

const { bind, sync, destroy, requestClose } = vi.hoisted(() => ({
  bind: vi.fn(),
  sync: vi.fn(),
  destroy: vi.fn(),
  requestClose: vi.fn(),
}));
vi.mock("@/application/providers/ServiceProvider", () => ({
  useServices: () => ({ bindDialog: bind }),
}));
beforeEach(() => {
  vi.clearAllMocks();
  bind.mockReturnValue({ sync, destroy, requestClose });
});

describe("Dialog presentation and binding", () => {
  it("associates unique visible titles and only short supplied descriptions", () => {
    const fallbackFocusRef = createRef<HTMLHeadingElement>();
    const props = { open: false, onCloseRequest: vi.fn(), fallbackFocusRef };
    render(
      <>
        <Dialog {...props} title="First" description="Short summary">
          <p>Long body</p>
        </Dialog>
        <Dialog {...props} title="Second">
          <p>Other body</p>
        </Dialog>
      </>,
    );
    const nodes = screen.getAllByRole("dialog", { hidden: true });
    expect(screen.queryByRole("banner", { hidden: true })).toBeNull();
    expect(nodes[0]).toHaveAttribute(
      "aria-labelledby",
      screen.getByText("First").id,
    );
    expect(nodes[1]).toHaveAttribute(
      "aria-labelledby",
      screen.getByText("Second").id,
    );
    expect(nodes[0].getAttribute("aria-labelledby")).not.toBe(
      nodes[1].getAttribute("aria-labelledby"),
    );
    expect(nodes[0]).toHaveAttribute(
      "aria-describedby",
      screen.getByText("Short summary").id,
    );
    expect(nodes[1]).not.toHaveAttribute("aria-describedby");
    expect(nodes[0]).not.toHaveAttribute("open");
    expect(nodes[0]).not.toHaveAttribute("tabindex");
    expect(screen.getByText("First")).toHaveAttribute("tabindex", "-1");
    const closes = screen.getAllByRole("button", {
      name: "Close",
      hidden: true,
    });
    expect(closes[0]).toHaveAttribute("type", "button");
    expect(closes[0]).toHaveAttribute("aria-label", "Close");
    expect(closes[0]).toHaveTextContent("");
    fireEvent.click(closes[0]);
    expect(requestClose).toHaveBeenCalledOnce();
  });

  it("keeps content values, uses current callbacks/refs without rebinding, and disposes", () => {
    const fallbackFocusRef = createRef<HTMLHeadingElement>();
    const first = vi.fn();
    const next = vi.fn();
    const props = { title: "Example", fallbackFocusRef };
    const view = render(
      <Dialog {...props} open onCloseRequest={first}>
        <input aria-label="Value" defaultValue="Original" />
      </Dialog>,
    );
    const options = bind.mock.calls[0][1] as DialogBindingOptions<HTMLElement>;
    const field = screen.getByRole("textbox", { hidden: true });
    fireEvent.change(field, { target: { value: "Retained" } });
    view.rerender(
      <Dialog {...props} open={false} onCloseRequest={next}>
        <input aria-label="Value" defaultValue="Original" />
      </Dialog>,
    );
    options.onCloseRequest("cancel");
    expect(next).toHaveBeenCalledWith("cancel");
    expect(first).not.toHaveBeenCalled();
    expect(bind).toHaveBeenCalledOnce();
    expect(sync).toHaveBeenLastCalledWith(false);
    expect(field).toHaveValue("Retained");
    expect(options.defaultFocus()).toBe(screen.getByText("Example"));
    view.unmount();
    expect(destroy).toHaveBeenCalledOnce();
  });

  it("balances Strict Mode setup and cleanup", () => {
    const view = render(
      <StrictMode>
        <Dialog
          title="Replay"
          open
          fallbackFocusRef={createRef()}
          onCloseRequest={vi.fn()}
        >
          Content
        </Dialog>
      </StrictMode>,
    );
    expect(bind).toHaveBeenCalledTimes(2);
    expect(destroy).toHaveBeenCalledOnce();
    view.unmount();
    expect(destroy).toHaveBeenCalledTimes(2);
  });
});
