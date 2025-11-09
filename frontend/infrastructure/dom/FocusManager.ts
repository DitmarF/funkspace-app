/**
 * Focus Manager
 * Infrastructure for focus management operations
 */

/**
 * Finds the first focusable element within a container.
 * Focusable elements include: input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])
 */
export function findFirstFocusable(container: HTMLElement): HTMLElement | null {
  const focusableSelectors = [
    'input:not([disabled]):not([type="hidden"])',
    "button:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  const focusable = container.querySelector(focusableSelectors);
  return focusable as HTMLElement | null;
}

/**
 * Scrolls to a section and focuses the first focusable element within it.
 */
export function focusIntoSection(
  sectionId: string,
  options: {
    scrollContainer?: HTMLElement | null;
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
  } = {},
): boolean {
  const { behavior = "smooth", block = "start" } = options;

  // Find the section element
  const section = document.getElementById(sectionId);
  if (!section) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[focusIntoSection] Section with ID "${sectionId}" not found`,
      );
    }
    return false;
  }

  // Scroll to the section
  section.scrollIntoView({
    behavior,
    block,
    inline: "nearest",
  });

  // Wait for scroll to complete (if smooth), then focus
  const focusElement = () => {
    const focusable = findFirstFocusable(section);
    const target = focusable || section;

    // Focus the element
    target.focus();
  };

  if (behavior === "smooth") {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      // Server-side fallback: immediate focus
      focusElement();
    } else {
      // Extract window to avoid type narrowing issues
      const win = window;
      // Check if scrollend event is supported (avoid 'in' operator to prevent type narrowing)
      const hasScrollEnd = typeof win.onscrollend !== "undefined";
      if (hasScrollEnd) {
        // Use scrollend event if available
        const handleScrollEnd = () => {
          focusElement();
          section.removeEventListener("scrollend", handleScrollEnd);
        };
        section.addEventListener("scrollend", handleScrollEnd, { once: true });
      } else {
        // Fallback: poll scroll position until stable
        let lastScrollTop = win.scrollY;
        let lastScrollLeft = win.scrollX;
        let stableCount = 0;
        const checkScrollComplete = () => {
          const currentScrollTop = win.scrollY;
          const currentScrollLeft = win.scrollX;

          if (
            currentScrollTop === lastScrollTop &&
            currentScrollLeft === lastScrollLeft
          ) {
            stableCount++;
            if (stableCount >= 2) {
              focusElement();
              return;
            }
          } else {
            stableCount = 0;
          }

          lastScrollTop = currentScrollTop;
          lastScrollLeft = currentScrollLeft;
          requestAnimationFrame(checkScrollComplete);
        };

        setTimeout(() => {
          requestAnimationFrame(checkScrollComplete);
        }, 50);
      }
    }
  } else {
    // Immediate focus for auto scroll
    focusElement();
  }

  return true;
}

/**
 * Handles anchor navigation (hash links) and focuses into the target section.
 */
export function handleAnchorNavigation(
  hash: string,
  options?: Parameters<typeof focusIntoSection>[1],
): boolean {
  // Remove leading # if present
  const sectionId = hash.replace(/^#/, "");

  if (!sectionId) {
    return false;
  }

  return focusIntoSection(sectionId, options);
}
