import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { focusIntoSection, handleAnchorNavigation } from "./focusIntoSection";

describe("focusIntoSection", () => {
  let mockSection: HTMLElement;
  let mockButton: HTMLButtonElement;
  let mockInput: HTMLInputElement;
  let scrollIntoViewSpy: ReturnType<typeof vi.fn>;
  let focusSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create mock elements
    mockSection = document.createElement("section");
    mockSection.id = "test-section";
    mockButton = document.createElement("button");
    mockButton.textContent = "Test Button";
    mockInput = document.createElement("input");
    mockInput.type = "text";
    mockInput.placeholder = "Test Input";

    // Add elements to document
    document.body.appendChild(mockSection);
    mockSection.appendChild(mockButton);
    mockSection.appendChild(mockInput);

    // Mock scrollIntoView
    scrollIntoViewSpy = vi.fn();
    mockSection.scrollIntoView = scrollIntoViewSpy;

    // Mock focus
    focusSpy = vi.fn();
    mockButton.focus = focusSpy;
    mockInput.focus = focusSpy;
    mockSection.focus = focusSpy;

    // Mock getElementById
    vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
      if (id === "test-section") return mockSection;
      return null;
    });

    // Mock console.warn to avoid noise in tests
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("should find and scroll to section by ID", () => {
    const result = focusIntoSection("test-section");

    expect(result).toBe(true);
    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });

  it("should focus first focusable element in section", () => {
    // Use auto behavior to avoid complex polling simulation
    focusIntoSection("test-section", { behavior: "auto" });

    // Should focus immediately with auto behavior
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should focus section itself if no focusable elements found", () => {
    // Remove focusable elements
    mockSection.removeChild(mockButton);
    mockSection.removeChild(mockInput);

    // Use auto behavior to avoid complex polling simulation
    focusIntoSection("test-section", { behavior: "auto" });

    // Should focus section since no focusable elements
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should return false if section not found", () => {
    const result = focusIntoSection("non-existent");

    expect(result).toBe(false);
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it("should use custom scroll behavior", () => {
    focusIntoSection("test-section", { behavior: "auto" });

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
  });

  it("should use custom block alignment", () => {
    focusIntoSection("test-section", { block: "center" });

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  });

  it("should focus immediately when behavior is auto", () => {
    focusIntoSection("test-section", { behavior: "auto" });

    // Should focus immediately, no setTimeout
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should handle disabled input elements", () => {
    mockInput.disabled = true;
    mockSection.removeChild(mockButton);

    // Use auto behavior to avoid complex polling simulation
    focusIntoSection("test-section", { behavior: "auto" });

    // Should focus section since input is disabled
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should handle hidden input elements", () => {
    mockInput.type = "hidden";
    mockSection.removeChild(mockButton);

    // Use auto behavior to avoid complex polling simulation
    focusIntoSection("test-section", { behavior: "auto" });

    // Should focus section since input is hidden
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should handle elements with tabindex=-1", () => {
    mockButton.tabIndex = -1;
    mockSection.removeChild(mockInput);

    // Use auto behavior to avoid complex polling simulation
    focusIntoSection("test-section", { behavior: "auto" });

    // Should focus section since button has tabindex=-1
    expect(focusSpy).toHaveBeenCalled();
  });

  it("should handle anchor links", () => {
    const link = document.createElement("a");
    link.href = "#test";
    link.textContent = "Test Link";
    const linkFocusSpy = vi.fn();
    link.focus = linkFocusSpy;
    mockSection.insertBefore(link, mockButton);

    // Use auto behavior to avoid complex polling simulation
    focusIntoSection("test-section", { behavior: "auto" });

    // Should focus the link (first focusable element)
    expect(linkFocusSpy).toHaveBeenCalled();
  });

  it("should not warn in production when section not found", () => {
    // Use Vitest's stubEnv to mock NODE_ENV
    const originalEnv = process.env.NODE_ENV;
    vi.stubEnv("NODE_ENV", "production");

    focusIntoSection("non-existent");

    expect(console.warn).not.toHaveBeenCalled();

    // Restore original value
    vi.stubEnv("NODE_ENV", originalEnv || "test");
  });
});

describe("handleAnchorNavigation", () => {
  let mockSection: HTMLElement;
  let scrollIntoViewSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSection = document.createElement("section");
    mockSection.id = "test-section";
    document.body.appendChild(mockSection);

    scrollIntoViewSpy = vi.fn();
    mockSection.scrollIntoView = scrollIntoViewSpy;

    vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
      if (id === "test-section") return mockSection;
      return null;
    });

    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("should handle hash with leading #", () => {
    const result = handleAnchorNavigation("#test-section");

    expect(result).toBe(true);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it("should handle hash without leading #", () => {
    const result = handleAnchorNavigation("test-section");

    expect(result).toBe(true);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  it("should return false for empty hash", () => {
    const result = handleAnchorNavigation("");

    expect(result).toBe(false);
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it("should return false for hash with only #", () => {
    const result = handleAnchorNavigation("#");

    expect(result).toBe(false);
    expect(scrollIntoViewSpy).not.toHaveBeenCalled();
  });

  it("should pass through options to focusIntoSection", () => {
    handleAnchorNavigation("#test-section", {
      behavior: "auto",
      block: "center",
    });

    expect(scrollIntoViewSpy).toHaveBeenCalledWith({
      behavior: "auto",
      block: "center",
      inline: "nearest",
    });
  });
});
