import { createRef, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, expectTypeOf, it, vi } from "vitest";
import Button, { type ButtonProps } from "./Button";
import ButtonLink, { type ButtonLinkProps } from "./ButtonLink";

describe("Standard Button native contract", () => {
  it("supports both decorative slots and keeps the leading artwork during pending", () => {
    const props = {
      leadingIcon: (
        <svg data-testid="leading-art">
          <title>Arrow</title>
        </svg>
      ),
      trailingIcon: (
        <svg data-testid="trailing-art">
          <title>Settings</title>
        </svg>
      ),
      children: "Send",
    };
    const { rerender } = render(
      <Button {...props} size="large" pending={false} />,
    );
    const button = screen.getByRole("button", { name: "Send" });
    expect(screen.getByTestId("leading-art")).toBeInTheDocument();
    expect(screen.getByTestId("trailing-art")).toBeInTheDocument();
    expect(button).not.toHaveAttribute("size");
    expect(button).not.toHaveAttribute("leadingIcon");
    rerender(<Button {...props} size="large" pending />);
    expect(screen.getByTestId("leading-art")).toBeInTheDocument();
    expect(screen.queryByTestId("trailing-art")).not.toBeInTheDocument();
    expect(button).toHaveAccessibleName("Send");
    expect(button.lastElementChild).toHaveTextContent("…");
  });

  it("limits the API to the approved combinations", () => {
    expectTypeOf<{
      children: string;
      pending: boolean;
    }>().toExtend<ButtonProps>();
    expectTypeOf<{
      children: string;
      variant: "outlined";
      pending: true;
    }>().not.toExtend<ButtonProps>();
    expectTypeOf<{
      children: string;
      pending: true;
      disabled: true;
    }>().not.toExtend<ButtonProps>();
    expectTypeOf<{
      children: string;
      iconPosition: "trailing";
    }>().not.toExtend<ButtonProps>();
    expectTypeOf<{ children: string }>().not.toExtend<ButtonLinkProps>();
  });
  it("defaults to a non-submitting action and preserves submit/reset", async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label>
          Value
          <input defaultValue="initial" />
        </label>
        <Button>Action</Button>
        <Button type="submit" name="intent" value="save">
          Save
        </Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Action" }));
    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Action" })).toHaveAttribute(
      "type",
      "button",
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(submit).toHaveBeenCalledOnce();
    await user.type(screen.getByRole("textbox"), " changed");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("textbox")).toHaveValue("initial");
    expect(submit).toHaveBeenCalledOnce();
  });

  it.each(["{Enter}", " "])("activates once with %s", async (key) => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(<Button onClick={click}>Action</Button>);
    await user.tab();
    await user.keyboard(key);
    expect(click).toHaveBeenCalledOnce();
  });

  it("preserves native props, refs, class/style extension and event callbacks", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const capture = vi.fn();
    const key = vi.fn();
    render(
      <Button
        ref={ref}
        id="action"
        name="intent"
        value="save"
        title="Details"
        form="external-form"
        className="consumer-class"
        style={{ marginTop: 8 }}
        aria-describedby="help"
        onClickCapture={capture}
        onKeyDownCapture={key}
      >
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(ref.current).toBe(button);
    expect(button).toHaveClass("consumer-class");
    expect(button).toHaveStyle({ marginTop: "8px" });
    for (const [name, value] of Object.entries({
      id: "action",
      name: "intent",
      value: "save",
      title: "Details",
      form: "external-form",
      "aria-describedby": "help",
    }))
      expect(button).toHaveAttribute(name, value);
    ref.current?.focus();
    await user.keyboard("{Enter}");
    expect(capture).toHaveBeenCalledOnce();
    expect(key).toHaveBeenCalledOnce();
  });

  it("blocks native disabled activation and skips it in keyboard traversal", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <>
        <Button disabled onClick={click}>
          Unavailable
        </Button>
        <Button>Next</Button>
      </>,
    );
    const button = screen.getByRole("button", { name: "Unavailable" });
    expect(button).toBeDisabled();
    await user.click(button);
    button.click();
    await user.tab();
    expect(screen.getByRole("button", { name: "Next" })).toHaveFocus();
    expect(click).not.toHaveBeenCalled();
  });

  it("retains focus/name during pending and blocks callbacks, bubbling and submission", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const submit = vi.fn();
    const bubble = vi.fn();
    function Example() {
      const [pending, setPending] = useState(false);
      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          onClick={bubble}
        >
          <Button
            type="submit"
            pending={pending}
            aria-describedby="help"
            onClick={() => {
              click();
              setPending(true);
            }}
          >
            Send message
          </Button>
          <p id="help">Local example</p>
        </form>
      );
    }
    render(<Example />);
    const button = screen.getByRole("button", { name: "Send message" });
    await user.tab();
    await user.keyboard("{Enter}");
    expect(button).toHaveFocus();
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAccessibleDescription("Local example Working…");
    expect(screen.getByRole("status")).toHaveTextContent("Working…");
    const initialSubmits = submit.mock.calls.length;
    expect(initialSubmits).toBe(1);
    const initialBubbles = bubble.mock.calls.length;
    await user.click(button);
    await user.keyboard("{Enter} {Enter}");
    button.click();
    expect(click).toHaveBeenCalledOnce();
    expect(submit).toHaveBeenCalledTimes(initialSubmits);
    expect(bubble).toHaveBeenCalledTimes(initialBubbles);
    expect(button).toHaveAccessibleName("Send message");
  });

  it("blocks activation key callbacks while pending but permits navigation keys", () => {
    const keyDown = vi.fn();
    const keyUp = vi.fn();
    const click = vi.fn();
    render(
      <Button
        pending
        onKeyDown={keyDown}
        onKeyUp={keyUp}
        onClickCapture={click}
      >
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    for (const key of ["Enter", " "]) {
      fireEvent.keyDown(button, { key });
      fireEvent.keyUp(button, { key });
    }
    fireEvent.click(button);
    expect(click).not.toHaveBeenCalled();
    expect(keyDown).not.toHaveBeenCalled();
    expect(keyUp).not.toHaveBeenCalled();
    fireEvent.keyDown(button, { key: "Tab" });
    expect(keyDown).toHaveBeenCalledOnce();
  });

  it("restores activation without replacing the button after pending", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const { rerender } = render(
      <Button pending={false} onClick={click}>
        Send
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Send" });
    button.focus();
    rerender(
      <Button pending onClick={click}>
        Send
      </Button>,
    );
    expect(button).toHaveFocus();
    rerender(
      <Button pending={false} onClick={click}>
        Send
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Send" })).toBe(button);
    expect(button).toHaveFocus();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    await user.keyboard(" ");
    expect(click).toHaveBeenCalledOnce();
  });

  it.each(["leading", "trailing"] as const)(
    "places a decorative %s icon without duplicating the name",
    (position) => {
      render(
        <Button
          icon={
            <svg role="img">
              <title>Decorative arrow</title>
            </svg>
          }
          iconPosition={position}
        >
          Visible label
        </Button>,
      );
      const button = screen.getByRole("button", { name: "Visible label" });
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      const icon = button.querySelector('[aria-hidden="true"]');
      expect(icon).toHaveAttribute("inert");
      expect(
        position === "leading"
          ? button.firstElementChild
          : button.lastElementChild,
      ).toBe(icon);
    },
  );
});

describe("ButtonLink", () => {
  it("keeps native anchor props, ref and name; no button semantics", () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <ButtonLink
        ref={ref}
        href="/about"
        target="_blank"
        rel="noopener"
        download="about.html"
        className="consumer-link"
        icon={<span>→</span>}
      >
        More about FunkSpace
      </ButtonLink>,
    );
    const link = screen.getByRole("link", { name: "More about FunkSpace" });
    expect(ref.current).toBe(link);
    expect(link).toHaveAttribute("href", "/about");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link).toHaveAttribute("download", "about.html");
    expect(link).toHaveClass("consumer-link");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(link).not.toHaveAttribute("aria-disabled");
    expect(link).not.toHaveAttribute("aria-busy");
  });
});
