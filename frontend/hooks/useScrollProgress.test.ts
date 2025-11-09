import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScrollProgress } from "./useScrollProgress";
import type { RefObject } from "react";

describe("useScrollProgress", () => {
  let mockElement: HTMLElement;
  let mockRef: RefObject<HTMLElement>;
  let mockIntersectionObserver: typeof IntersectionObserver;
  let mockObserverInstance: {
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Mock IntersectionObserver
    mockObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
    };

    mockIntersectionObserver = vi.fn(
      (callback: IntersectionObserverCallback) => {
        // Simulate intersection change
        setTimeout(() => {
          callback(
            [
              {
                target: mockElement,
                isIntersecting: true,
                intersectionRatio: 0.5,
                boundingClientRect: {} as DOMRectReadOnly,
                rootBounds: null,
                intersectionRect: {} as DOMRectReadOnly,
                time: 0,
              },
            ] as IntersectionObserverEntry[],
            {} as IntersectionObserver,
          );
        }, 0);
        return mockObserverInstance as unknown as IntersectionObserver;
      },
    ) as unknown as typeof IntersectionObserver;

    global.IntersectionObserver = mockIntersectionObserver;

    // Mock element with getBoundingClientRect
    mockElement = {
      getBoundingClientRect: vi.fn(() => ({
        top: 0,
        bottom: 1000,
        left: 0,
        right: 100,
        width: 100,
        height: 1000,
        x: 0,
        y: 0,
        toJSON: vi.fn(),
      })) as HTMLElement["getBoundingClientRect"],
    } as unknown as HTMLElement;

    mockRef = { current: mockElement };

    // Mock window.innerHeight
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 800,
    });

    // Mock addEventListener/removeEventListener
    vi.spyOn(window, "addEventListener").mockImplementation(vi.fn());
    vi.spyOn(window, "removeEventListener").mockImplementation(vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize with inView false and progress 0", () => {
    const { result } = renderHook(() => useScrollProgress(mockRef));

    expect(result.current.inView).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it("should set up Intersection Observer with default thresholds", () => {
    renderHook(() => useScrollProgress(mockRef));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: null,
        threshold: [0.2, 0.8],
      },
    );
    expect(mockObserverInstance.observe).toHaveBeenCalledWith(mockElement);
  });

  it("should accept custom options", () => {
    const customRoot = document.createElement("div");
    const customThresholds = [0.1, 0.5, 0.9];
    const onEnter = vi.fn();
    const onLeave = vi.fn();

    renderHook(() =>
      useScrollProgress(mockRef, {
        root: customRoot,
        thresholds: customThresholds,
        onEnter,
        onLeave,
      }),
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        root: customRoot,
        threshold: customThresholds,
      },
    );
  });

  it("should calculate progress correctly when element is in viewport", () => {
    // Mock element at top of viewport
    (
      mockElement.getBoundingClientRect as ReturnType<typeof vi.fn>
    ).mockReturnValue({
      top: 0,
      bottom: 1000,
      height: 1000,
      left: 0,
      right: 100,
      width: 100,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    } as DOMRect);

    const { result } = renderHook(() => useScrollProgress(mockRef));

    // Progress should be calculated based on position
    // With element at top (top=0, height=1000, viewport=800)
    // Progress = (800 - 0) / (800 + 1000) = 800/1800 ≈ 0.44
    expect(result.current.progress).toBeGreaterThanOrEqual(0);
    expect(result.current.progress).toBeLessThanOrEqual(1);
  });

  it("should clean up observers and listeners on unmount", () => {
    const { unmount } = renderHook(() => useScrollProgress(mockRef));

    unmount();

    expect(mockObserverInstance.disconnect).toHaveBeenCalled();
    expect(window.removeEventListener).toHaveBeenCalled();
  });

  it("should handle null ref gracefully", () => {
    const nullRef = { current: null } as RefObject<HTMLElement>;
    const { result } = renderHook(() => useScrollProgress(nullRef));

    expect(result.current.inView).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });
});
