import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ContactPage from "./page";

const fixture = vi.hoisted(() => ({
  available: false,
  compose: vi.fn(),
  form: vi.fn(),
}));

// The page consumes only safe availability; this test never constructs the
// server delivery adapter or browser submission port.
vi.mock("@/infrastructure/services/createContactServerServices", () => ({
  createContactServerServices: () => {
    fixture.compose();
    return { available: fixture.available };
  },
}));
vi.mock("@/components/Layouts/PortfolioShell", () => ({
  default: ({ children }: { children: ReactNode }) => <main>{children}</main>,
}));
vi.mock("@/features/contact/ContactForm", () => ({
  default: ({ available }: { available: boolean }) => {
    fixture.form(available);
    return <form aria-label="Contact inquiry" />;
  },
}));

beforeEach(() => {
  fixture.available = false;
  fixture.compose.mockClear();
  fixture.form.mockClear();
});

describe("contact page availability notice", () => {
  it.each([false, true])(
    "keeps the notice consistent with safe server availability (%s)",
    (available) => {
      fixture.available = available;
      render(<ContactPage />);
      expect(fixture.compose).toHaveBeenCalledOnce();
      expect(fixture.form).toHaveBeenCalledWith(available);
      expect(
        screen.getByRole("form", { name: "Contact inquiry" }),
      ).toBeVisible();
      const notice = screen.getByText(/Your email address and message/);
      expect(notice).toHaveTextContent("A name is optional");
      if (available)
        expect(notice).not.toHaveTextContent(
          "Form delivery is currently disabled",
        );
      else
        expect(notice).toHaveTextContent(
          "Form delivery is currently disabled; you can use the email link instead.",
        );
      expect(
        screen.getByRole("link", { name: "Privacy information" }),
      ).toHaveAttribute("href", "/privacy");
      expect(
        screen.getByRole("link", { name: "info@funkspace.de" }),
      ).toHaveAttribute("href", "mailto:info@funkspace.de");
    },
  );
});
