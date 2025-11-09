/**
 * Scroll Service
 * Application service for scroll progress tracking
 */

export interface ScrollProgress {
  inView: boolean;
  progress: number; // 0 to 1
}

export interface ScrollService {
  /**
   * Calculate scroll progress for an element
   */
  calculateProgress(element: HTMLElement): number;

  /**
   * Check if element is in viewport
   */
  isInView(element: HTMLElement, threshold?: number): boolean;
}

export class ScrollServiceImpl implements ScrollService {
  calculateProgress(element: HTMLElement): number {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const sectionTop = rect.top;
    const sectionBottom = rect.bottom;
    const sectionHeight = rect.height;

    if (sectionTop > viewportHeight) {
      // Section is below viewport (not yet entered)
      return 0;
    }

    if (sectionBottom < 0) {
      // Section is above viewport (fully scrolled past)
      return 1;
    }

    // Section is intersecting viewport
    // Progress from 0 (top entering) to 1 (bottom at top)
    const scrollableDistance = viewportHeight + sectionHeight;
    const scrolledDistance = viewportHeight - sectionBottom;
    return Math.max(0, Math.min(1, scrolledDistance / scrollableDistance));
  }

  isInView(element: HTMLElement, threshold: number = 0.2): boolean {
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if element intersects viewport with threshold
    const topVisible = rect.top < viewportHeight * (1 - threshold);
    const bottomVisible = rect.bottom > viewportHeight * threshold;
    const leftVisible = rect.left < viewportWidth;
    const rightVisible = rect.right > 0;

    return topVisible && bottomVisible && leftVisible && rightVisible;
  }
}
