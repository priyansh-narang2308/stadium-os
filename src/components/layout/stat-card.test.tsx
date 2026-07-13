import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('should render title and value', () => {
    const { container } = render(<StatCard title="Total Attendance" value="52,418" />);
    expect(container.textContent).toContain('Total Attendance');
    expect(container.textContent).toContain('52,418');
  });

  it('should render subtitle when provided', () => {
    const { container } = render(
      <StatCard title="Total Attendance" value="52,418" subtitle="65.5% capacity" />
    );
    expect(container.textContent).toContain('65.5% capacity');
  });

  it('should render icon when provided', () => {
    const icon = <div data-testid="test-icon">Icon</div>;
    const { container } = render(<StatCard title="Test" value="100" icon={icon} />);
    const testIcon = container.querySelector('[data-testid="test-icon"]');
    expect(testIcon).toBeInTheDocument();
  });

  it('should render trend when provided', () => {
    const { container } = render(
      <StatCard
        title="Test"
        value="100"
        trend="up"
        trendValue="+12% from last hour"
      />
    );
    expect(container.textContent).toContain('+12% from last hour');
  });

  it('should show upward arrow for up trend', () => {
    const { container } = render(
      <StatCard title="Test" value="100" trend="up" trendValue="+12%" />
    );
    expect(container.textContent).toContain('↑');
  });

  it('should show downward arrow for down trend', () => {
    const { container } = render(
      <StatCard title="Test" value="100" trend="down" trendValue="-12%" />
    );
    expect(container.textContent).toContain('↓');
  });

  it('should show right arrow for neutral trend', () => {
    const { container } = render(
      <StatCard title="Test" value="100" trend="neutral" trendValue="0%" />
    );
    expect(container.textContent).toContain('→');
  });

  it('should apply destructive color for up trend', () => {
    const { container } = render(
      <StatCard title="Test" value="100" trend="up" trendValue="+12%" />
    );
    const trendElement = container.querySelector('.text-destructive');
    expect(trendElement).toBeInTheDocument();
  });

  it('should apply green color for down trend', () => {
    const { container } = render(
      <StatCard title="Test" value="100" trend="down" trendValue="-12%" />
    );
    const trendElement = container.querySelector('.text-green-600');
    expect(trendElement).toBeInTheDocument();
  });
});
