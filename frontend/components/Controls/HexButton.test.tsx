import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import HexButton from "./HexButton";

describe("HexButton native contract", () => {
  it("provides a named icon-only Close action without a Menu label", async () => {
    const click = vi.fn();
    const user = userEvent.setup();
    render(
      <HexButton
        icon="close"
        variant="secondary"
        size="small"
        aria-label="Close"
        onClick={click}
      />,
    );
    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveTextContent("");
    expect(screen.queryByText("Menu")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    await user.tab();
    await user.keyboard("{Enter}");
    expect(click).toHaveBeenCalledOnce();
  });
  it("has an accessible Menu name without a visible caption and inert decorative artwork", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <HexButton
        ref={ref}
        className="consumer"
        name="intent"
        value="menu"
        aria-describedby="help"
      />,
    );
    const button = screen.getByRole("button", { name: "Menu" });
    expect(button.textContent).toBe("");
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("consumer");
    expect(button).toHaveAttribute("name", "intent");
    expect(button).toHaveAttribute("value", "menu");
    expect(button).toHaveAttribute("aria-describedby", "help");
    expect(button).not.toHaveAttribute("aria-pressed");
    expect(button.querySelector('[aria-hidden="true"]')).toHaveAttribute(
      "inert",
    );
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it.each([
    ["navigation", "Navigation"],
    ["a11y", "Accessibility"],
    ["chat-bot", "Chat-bot"],
    ["languages", "Languages"],
  ] as const)("names icon-only %s controls without a caption", (icon, name) => {
    render(<HexButton icon={icon} />);
    expect(screen.getByRole("button", { name }).textContent).toBe("");
  });

  it.each(["{Enter}", " "])("activates once with %s", async (key) => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(<HexButton onClick={click} />);
    await user.tab();
    await user.keyboard(key);
    expect(click).toHaveBeenCalledOnce();
  });

  it("blocks disabled input and skips the unavailable control", async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <>
        <HexButton disabled onClick={click} />
        <HexButton>Next menu</HexButton>
      </>,
    );
    const disabled = screen.getByRole("button", { name: "Menu" });
    await user.click(disabled);
    disabled.click();
    await user.tab();
    expect(screen.getByRole("button", { name: "Next menu" })).toHaveFocus();
    expect(click).not.toHaveBeenCalled();
  });

  it("preserves explicit submit and reset without submitting the default action", async () => {
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
        <HexButton />
        <HexButton type="submit">Submit</HexButton>
        <HexButton type="reset">Reset</HexButton>
      </form>,
    );
    await user.click(screen.getByRole("button", { name: "Menu" }));
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(submit).toHaveBeenCalledOnce();
    await user.type(screen.getByRole("textbox"), " changed");
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("textbox")).toHaveValue("initial");
    expect(submit).toHaveBeenCalledOnce();
  });
});
