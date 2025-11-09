import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Container from "./Container";

describe("Container", () => {
  it("should render with default props", () => {
    render(
      <Container>
        <div>Test content</div>
      </Container>,
    );

    const container = screen.getByText("Test content").parentElement;
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("w-full");
    expect(container).toHaveClass("max-w-5xl");
    expect(container).toHaveClass("mx-auto");
    expect(container).toHaveClass("px-4");
    expect(container).toHaveClass("py-6");
    expect(container).toHaveClass("md:px-6");
    expect(container).toHaveClass("md:py-8");
  });

  it("should render children correctly", () => {
    render(
      <Container>
        <div>Child 1</div>
        <div>Child 2</div>
      </Container>,
    );

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  describe("width variants", () => {
    it("should apply xs width", () => {
      render(
        <Container width="xs">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("max-w-xs");
    });

    it("should apply sm width", () => {
      render(
        <Container width="sm">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("max-w-sm");
    });

    it("should apply narrow width", () => {
      render(
        <Container width="narrow">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("max-w-xl");
    });

    it("should apply sm-medium width", () => {
      render(
        <Container width="sm-medium">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("max-w-2xl");
    });

    it("should apply medium width", () => {
      render(
        <Container width="medium">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("max-w-4xl");
    });

    it("should apply default width", () => {
      render(
        <Container width="default">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("max-w-5xl");
    });

    it("should apply wide width", () => {
      render(
        <Container width="wide">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("max-w-7xl");
    });

    it("should apply full width", () => {
      render(
        <Container width="full">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("max-w-full");
    });
  });

  describe("alignment", () => {
    it("should apply center alignment by default", () => {
      render(
        <Container>
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("mx-auto");
    });

    it("should apply left alignment", () => {
      render(
        <Container align="left">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("mr-auto");
      expect(container).not.toHaveClass("mx-auto");
    });

    it("should apply center alignment", () => {
      render(
        <Container align="center">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("mx-auto");
    });

    it("should apply right alignment", () => {
      render(
        <Container align="right">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("ml-auto");
      expect(container).not.toHaveClass("mx-auto");
    });
  });

  describe("spacing", () => {
    it("should not apply spacing by default", () => {
      render(
        <Container>
          <div>Child 1</div>
          <div>Child 2</div>
        </Container>,
      );

      const container = screen.getByText("Child 1").parentElement;
      expect(container).not.toHaveClass("space-y-2");
      expect(container).not.toHaveClass("space-y-4");
      expect(container).not.toHaveClass("space-y-6");
      expect(container).not.toHaveClass("space-y-8");
    });

    it("should apply tight spacing", () => {
      render(
        <Container spacing="tight">
          <div>Child 1</div>
          <div>Child 2</div>
        </Container>,
      );

      const container = screen.getByText("Child 1").parentElement;
      expect(container).toHaveClass("space-y-2");
    });

    it("should apply normal spacing", () => {
      render(
        <Container spacing="normal">
          <div>Child 1</div>
          <div>Child 2</div>
        </Container>,
      );

      const container = screen.getByText("Child 1").parentElement;
      expect(container).toHaveClass("space-y-4");
    });

    it("should apply medium spacing", () => {
      render(
        <Container spacing="medium">
          <div>Child 1</div>
          <div>Child 2</div>
        </Container>,
      );

      const container = screen.getByText("Child 1").parentElement;
      expect(container).toHaveClass("space-y-6");
    });

    it("should apply loose spacing", () => {
      render(
        <Container spacing="loose">
          <div>Child 1</div>
          <div>Child 2</div>
        </Container>,
      );

      const container = screen.getByText("Child 1").parentElement;
      expect(container).toHaveClass("space-y-8");
    });

    it("should apply none spacing", () => {
      render(
        <Container spacing="none">
          <div>Child 1</div>
          <div>Child 2</div>
        </Container>,
      );

      const container = screen.getByText("Child 1").parentElement;
      expect(container).not.toHaveClass("space-y-2");
      expect(container).not.toHaveClass("space-y-4");
      expect(container).not.toHaveClass("space-y-6");
      expect(container).not.toHaveClass("space-y-8");
    });
  });

  describe("padding", () => {
    it("should apply medium padding by default", () => {
      render(
        <Container>
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("py-6");
      expect(container).toHaveClass("md:px-6");
      expect(container).toHaveClass("md:py-8");
    });

    it("should apply no padding", () => {
      render(
        <Container padding="none">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).not.toHaveClass("px-4");
      expect(container).not.toHaveClass("py-6");
      expect(container).not.toHaveClass("md:px-6");
      expect(container).not.toHaveClass("md:py-8");
    });

    it("should apply small padding", () => {
      render(
        <Container padding="sm">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("py-4");
      expect(container).toHaveClass("md:px-6");
      expect(container).toHaveClass("md:py-6");
    });

    it("should apply medium padding", () => {
      render(
        <Container padding="md">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("py-6");
      expect(container).toHaveClass("md:px-6");
      expect(container).toHaveClass("md:py-8");
    });

    it("should apply large padding", () => {
      render(
        <Container padding="lg">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByText("Content").parentElement;
      expect(container).toHaveClass("px-6");
      expect(container).toHaveClass("py-8");
      expect(container).toHaveClass("md:px-8");
      expect(container).toHaveClass("md:py-12");
    });
  });

  it("should apply custom className", () => {
    render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("should apply both custom className and default classes", () => {
    render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>,
    );

    const container = screen.getByText("Content").parentElement;
    expect(container).toHaveClass("custom-class");
    expect(container).toHaveClass("w-full");
    expect(container).toHaveClass("max-w-5xl");
    expect(container).toHaveClass("mx-auto");
  });

  it("should pass through additional props", () => {
    render(
      <Container
        data-testid="container"
        aria-label="Container"
        id="test-container"
      >
        <div>Content</div>
      </Container>,
    );

    const container = screen.getByTestId("container");
    expect(container).toHaveAttribute("aria-label", "Container");
    expect(container).toHaveAttribute("id", "test-container");
  });

  it("should handle empty children", () => {
    render(<Container />);

    const container = document.querySelector(".w-full");
    expect(container).toBeInTheDocument();
    expect(container?.children.length).toBe(0);
  });

  it("should combine all props correctly", () => {
    render(
      <Container
        width="medium"
        align="left"
        spacing="normal"
        padding="lg"
        className="custom-class"
        data-testid="combined"
      >
        <div>Content</div>
      </Container>,
    );

    const container = screen.getByTestId("combined");
    expect(container).toHaveClass("max-w-4xl");
    expect(container).toHaveClass("mr-auto");
    expect(container).toHaveClass("space-y-4");
    expect(container).toHaveClass("px-6");
    expect(container).toHaveClass("py-8");
    expect(container).toHaveClass("md:px-8");
    expect(container).toHaveClass("md:py-12");
    expect(container).toHaveClass("custom-class");
  });

  it("should maintain backward compatibility with existing width values", () => {
    render(
      <>
        <Container width="narrow" data-testid="narrow">
          <div>Narrow</div>
        </Container>
        <Container width="default" data-testid="default">
          <div>Default</div>
        </Container>
        <Container width="wide" data-testid="wide">
          <div>Wide</div>
        </Container>
      </>,
    );

    expect(screen.getByTestId("narrow")).toHaveClass("max-w-xl");
    expect(screen.getByTestId("default")).toHaveClass("max-w-5xl");
    expect(screen.getByTestId("wide")).toHaveClass("max-w-7xl");
  });

  describe("semantic HTML elements", () => {
    it("should render as div by default", () => {
      render(
        <Container data-testid="container">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("DIV");
    });

    it("should render as section when as='section'", () => {
      render(
        <Container as="section" data-testid="container">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("SECTION");
    });

    it("should render as article when as='article'", () => {
      render(
        <Container as="article" data-testid="container">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("ARTICLE");
    });

    it("should render as main when as='main'", () => {
      render(
        <Container as="main" data-testid="container">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("MAIN");
    });

    it("should render as header when as='header'", () => {
      render(
        <Container as="header" data-testid="container">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("HEADER");
    });

    it("should render as footer when as='footer'", () => {
      render(
        <Container as="footer" data-testid="container">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("FOOTER");
    });

    it("should render as aside when as='aside'", () => {
      render(
        <Container as="aside" data-testid="container">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("ASIDE");
    });

    it("should render as nav when as='nav'", () => {
      render(
        <Container as="nav" data-testid="container">
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("NAV");
    });

    it("should apply all container props when using semantic element", () => {
      render(
        <Container
          as="section"
          width="medium"
          align="left"
          spacing="normal"
          padding="lg"
          className="custom-class"
          data-testid="semantic-container"
        >
          <div>Content</div>
        </Container>,
      );

      const container = screen.getByTestId("semantic-container");
      expect(container.tagName).toBe("SECTION");
      expect(container).toHaveClass("max-w-4xl");
      expect(container).toHaveClass("mr-auto");
      expect(container).toHaveClass("space-y-4");
      expect(container).toHaveClass("px-6");
      expect(container).toHaveClass("py-8");
      expect(container).toHaveClass("custom-class");
    });
  });
});
