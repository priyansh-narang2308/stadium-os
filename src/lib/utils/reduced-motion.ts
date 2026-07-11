/**
 * Reduced Motion Support
 * Respects user's motion preferences
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function getAnimationDuration(defaultDuration: number): number {
  return prefersReducedMotion() ? 0 : defaultDuration;
}

export function getTransitionDuration(defaultDuration: number): number {
  return prefersReducedMotion() ? 0 : defaultDuration;
}
