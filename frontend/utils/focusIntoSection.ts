/**
 * Focus management utilities for full-screen scroll layouts with CSS Scroll Snap.
 *
 * Provides helpers for programmatic navigation to sections, ensuring focused
 * elements are not hidden behind sticky UI and that scroll snap still functions.
 */

/**
 * Finds the first focusable element within a container.
 * Focusable elements include: input, button, select, textarea, a[href], [tabindex]:not([tabindex="-1"])
 *
 * @param container - The container element to search within
 * @returns The first focusable element, or null if none found
 */
function findFirstFocusable(container: HTMLElement): HTMLElement | null {
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
 *
 * This function:
 * 1. Finds the section by ID
 * 2. Scrolls to it using `scrollIntoView()` with smooth behavior
 * 3. Focuses the first focusable element, or the section itself if none found
 * 4. Respects `scroll-padding-top` set on the scroll container
 *
 * The scroll container should have `scroll-padding-top` set to account for
 * any sticky headers, ensuring focused elements are not hidden.
 *
 * @param sectionId - The ID of the section to focus into
 * @param options - Optional configuration
 * @param options.scrollContainer - The scroll container element (defaults to document.documentElement or window)
 * @param options.behavior - Scroll behavior: 'smooth' (default) or 'auto'
 * @param options.block - Vertical alignment: 'start' (default), 'center', 'end', or 'nearest'
 * @returns True if the section was found and focused, false otherwise
 *
 * @example
 * ```tsx
 * // In a click handler or anchor navigation
 * focusIntoSection('hero');
 *
 * // With custom options
 * focusIntoSection('about', {
 *   behavior: 'smooth',
 *   block: 'start'
 * });
 * ```
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
  // The scroll-padding-top on the container will ensure the section
  // is not hidden behind sticky UI
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

    // If focusing the section itself, ensure it's keyboard accessible
    if (target === section && !target.hasAttribute("tabindex")) {
      // Section already has tabIndex={-1} from SnapSection, which is fine
      // We can still focus it programmatically
    }
  };

  if (behavior === "smooth") {
    // Use scrollend event if available (Chrome 114+, Safari 17+)
    // Otherwise fall back to polling scroll position
    if ("onscrollend" in window) {
      const handleScrollEnd = () => {
        focusElement();
        section.removeEventListener("scrollend", handleScrollEnd);
      };
      section.addEventListener("scrollend", handleScrollEnd, { once: true });
    } else {
      // Fallback: poll scroll position until stable
      let lastScrollTop = window.scrollY;
      let lastScrollLeft = window.scrollX;
      let stableCount = 0;
      const checkScrollComplete = () => {
        const currentScrollTop = window.scrollY;
        const currentScrollLeft = window.scrollX;

        if (
          currentScrollTop === lastScrollTop &&
          currentScrollLeft === lastScrollLeft
        ) {
          stableCount++;
          if (stableCount >= 2) {
            // Scroll position stable for 2 frames (~33ms at 60fps)
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

      // Start checking after a short delay to allow scroll to start
      setTimeout(() => {
        requestAnimationFrame(checkScrollComplete);
      }, 50);
    }
  } else {
    // Immediate focus for auto scroll
    focusElement();
  }

  return true;
}

/**
 * Handles anchor navigation (hash links) and focuses into the target section.
 *
 * This is useful for handling browser navigation (e.g., clicking a link with
 * `href="#hero"`) or programmatic navigation via `window.location.hash`.
 *
 * The function:
 * 1. Extracts the section ID from the hash
 * 2. Calls `focusIntoSection` to scroll and focus
 * 3. Updates the URL hash without triggering another scroll
 *
 * @param hash - The hash string (e.g., "#hero" or "hero")
 * @param options - Optional configuration (same as focusIntoSection)
 * @returns True if the section was found and focused, false otherwise
 *
 * @example
 * ```tsx
 * // Handle hash changes
 * window.addEventListener('hashchange', (e) => {
 *   handleAnchorNavigation(window.location.hash);
 * });
 *
 * // Or in a click handler
 * handleAnchorNavigation('#about');
 * ```
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
