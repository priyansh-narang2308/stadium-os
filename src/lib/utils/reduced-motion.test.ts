import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { prefersReducedMotion, getAnimationDuration, getTransitionDuration } from './reduced-motion';

describe('Reduced Motion Utilities', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('prefersReducedMotion', () => {
    it('should return false when reduced motion is not preferred', () => {
      (window.matchMedia as any).mockReturnValue({ matches: false });
      expect(prefersReducedMotion()).toBe(false);
    });

    it('should return true when reduced motion is preferred', () => {
      (window.matchMedia as any).mockReturnValue({ matches: true });
      expect(prefersReducedMotion()).toBe(true);
    });

    it('should return false when window is undefined', () => {
      vi.unstubAllGlobals();
      expect(prefersReducedMotion()).toBe(false);
    });
  });

  describe('getAnimationDuration', () => {
    it('should return 0 when reduced motion is preferred', () => {
      (window.matchMedia as any).mockReturnValue({ matches: true });
      expect(getAnimationDuration(500)).toBe(0);
    });

    it('should return default duration when reduced motion is not preferred', () => {
      (window.matchMedia as any).mockReturnValue({ matches: false });
      expect(getAnimationDuration(500)).toBe(500);
    });
  });

  describe('getTransitionDuration', () => {
    it('should return 0 when reduced motion is preferred', () => {
      (window.matchMedia as any).mockReturnValue({ matches: true });
      expect(getTransitionDuration(300)).toBe(0);
    });

    it('should return default duration when reduced motion is not preferred', () => {
      (window.matchMedia as any).mockReturnValue({ matches: false });
      expect(getTransitionDuration(300)).toBe(300);
    });
  });
});
