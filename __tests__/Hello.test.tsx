import { render, screen } from "@testing-library/react";
import { Hello } from "../src/components/Hello";

it("renders personalised greeting", () => {
  render(<Hello name="Coder" />);
  expect(screen.getByTestId("greeting")).toHaveTextContent("Hello Coder");
});
