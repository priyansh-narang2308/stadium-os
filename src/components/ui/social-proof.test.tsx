import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialProof } from './social-proof';

describe('SocialProof', () => {
  it('should render with default text', () => {
    render(<SocialProof />);
    expect(screen.getByText('Trusted by 200+ stadiums worldwide')).toBeDefined();
  });

  it('should render with custom text', () => {
    render(<SocialProof text="Used by FIFA World Cup 2026" />);
    expect(screen.getByText('Used by FIFA World Cup 2026')).toBeDefined();
  });

  it('should render star rating', () => {
    render(<SocialProof />);
    expect(screen.getByLabelText('5 star rating')).toBeDefined();
  });
});
