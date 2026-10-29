import { createRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TextField from "./TextField";
import TextAreaField from "./TextAreaField";
import InlineStatus from "./InlineStatus";

describe.each([
  ["input", TextField],
  ["textarea", TextAreaField],
] as const)("%s field", (_kind, Component) => {
  it("associates persistent labels, caller descriptions, help and actual errors", () => {
    const { rerender } = render(
      <>
        <p id="external">External help</p>
        <Component
          label="Example"
          id="chosen"
          help="Local help"
          error="Fix this value"
          aria-describedby="external external"
        />
      </>,
    );
    const field = screen.getByRole("textbox", { name: "Example" });
    expect(field).toHaveAttribute("id", "chosen");
    expect(field).toHaveAccessibleDescription(
      "External help Local help Error: Fix this value",
    );
    expect(field.getAttribute("aria-describedby")!.split(" ")).toHaveLength(3);
    expect(field).toHaveAttribute("aria-invalid", "true");
    const helpId = screen.getByText("Local help").id;
    rerender(
      <>
        <p id="external">External help</p>
        <Component
          label="Example"
          id="chosen"
          help="Local help"
          error="  "
          aria-describedby="external"
        />
      </>,
    );
    expect(screen.getByRole("textbox")).toBe(field);
    expect(field).not.toHaveAttribute("aria-invalid");
    expect(field).toHaveAccessibleDescription("External help Local help");
    expect(screen.getByText("Local help").id).toBe(helpId);
    expect(screen.queryByText("Error:")).not.toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("creates stable unique IDs across repeated instances", () => {
    const examples = (
      <>
        <Component label="One" help="Help one" error="Error one" />
        <Component label="Two" help="Help two" error="Error two" />
      </>
    );
    const { container, rerender } = render(examples);
    const ids = [...container.querySelectorAll("[id]")].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    rerender(examples);
    expect(
      [...container.querySelectorAll("[id]")].map((node) => node.id),
    ).toEqual(ids);
    for (const field of screen.getAllByRole("textbox")) {
      for (const id of field.getAttribute("aria-describedby")!.split(" "))
        expect(document.getElementById(id)).not.toBeNull();
    }
  });

  it("retains uncontrolled values across disabled, read-only and error changes", async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const base = {
      label: "Example",
      name: "sample",
      defaultValue: "Start",
      onChange: change,
      autoComplete: "off",
    };
    const { container, rerender } = render(
      <form>
        <Component {...base} />
      </form>,
    );
    const field = screen.getByRole("textbox");
    expect(field).not.toBeRequired();
    await user.type(field, " draft");
    expect(change).toHaveBeenCalled();
    rerender(
      <form>
        <Component {...base} disabled error="Example error" />
      </form>,
    );
    expect(field).toBeDisabled();
    expect(field).toHaveValue("Start draft");
    expect(new FormData(container.querySelector("form")!).has("sample")).toBe(
      false,
    );
    rerender(
      <form>
        <Component {...base} readOnly />
      </form>,
    );
    await user.type(field, " ignored");
    expect(field).toHaveValue("Start draft");
    expect(new FormData(container.querySelector("form")!).get("sample")).toBe(
      "Start draft",
    );
    rerender(
      <form>
        <Component {...base} />
      </form>,
    );
    await user.type(field, " kept");
    expect(field).toHaveValue("Start draft kept");
  });

  it("leaves controlled value ownership with the caller", async () => {
    const user = userEvent.setup();
    function Example() {
      const [value, setValue] = useState("");
      return (
        <Component
          label="Controlled"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      );
    }
    render(<Example />);
    await user.type(screen.getByRole("textbox"), "Saved in caller state");
    expect(screen.getByRole("textbox")).toHaveValue("Saved in caller state");
  });
});

describe("native field attributes and status", () => {
  it("preserves input refs, email type, native requirements and event props", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const blur = vi.fn();
    render(
      <TextField
        ref={ref}
        label="Address"
        type="email"
        name="email"
        autoComplete="email"
        required
        maxLength={80}
        inputMode="email"
        form="external-form"
        className="consumer"
        style={{ width: 200 }}
        onBlur={blur}
      />,
    );
    const input = screen.getByRole("textbox", { name: "Address (required)" });
    expect(ref.current).toBe(input);
    expect(input).toBeRequired();
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).toHaveClass("consumer");
    expect(input).toHaveStyle({ width: "200px" });
    for (const [key, value] of Object.entries({
      type: "email",
      name: "email",
      autocomplete: "email",
      maxlength: "80",
      inputmode: "email",
      form: "external-form",
    }))
      expect(input).toHaveAttribute(key, value);
    await user.click(screen.getByText("Address", { exact: false }));
    expect(input).toHaveFocus();
    await user.tab();
    expect(blur).toHaveBeenCalledOnce();
  });

  it("preserves textarea refs and caller sizing", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(
      <TextAreaField
        ref={ref}
        label="Notes"
        name="notes"
        rows={7}
        cols={40}
        wrap="hard"
        maxLength={600}
        autoComplete="off"
        defaultValue="Draft"
      />,
    );
    const textarea = screen.getByRole("textbox", { name: "Notes" });
    expect(ref.current).toBe(textarea);
    for (const [key, value] of Object.entries({
      name: "notes",
      rows: "7",
      cols: "40",
      wrap: "hard",
      maxlength: "600",
      autocomplete: "off",
    }))
      expect(textarea).toHaveAttribute(key, value);
    expect(textarea).toHaveValue("Draft");
  });

  it("updates one polite status in place without focus movement or unchanged-text mutations", async () => {
    const { rerender } = render(
      <>
        <button>Keep focus</button>
        <InlineStatus />
      </>,
    );
    const status = screen.getByRole("status");
    screen.getByRole("button").focus();
    expect(status).toBeEmptyDOMElement();
    rerender(
      <>
        <button>Keep focus</button>
        <InlineStatus message="Fixture: pending" />
      </>,
    );
    expect(screen.getByRole("status")).toBe(status);
    expect(status).toHaveTextContent("Fixture: pending");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
    expect(screen.getByRole("button")).toHaveFocus();
    const mutations = vi.fn();
    const observer = new MutationObserver(mutations);
    observer.observe(status, {
      childList: true,
      characterData: true,
      subtree: true,
    });
    rerender(
      <>
        <button>Keep focus</button>
        <InlineStatus message="Fixture: pending" />
      </>,
    );
    await Promise.resolve();
    expect(mutations).not.toHaveBeenCalled();
    observer.disconnect();
    rerender(
      <>
        <button>Keep focus</button>
        <InlineStatus message="Fixture: ready" />
      </>,
    );
    expect(status).toHaveTextContent("Fixture: ready");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
