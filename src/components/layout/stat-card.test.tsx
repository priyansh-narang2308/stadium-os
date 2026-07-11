import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './stat-card';

describe('StatCard', () => {
  it('should render title and value', () => {
    render(<StatCard title="Total Attendance" value="52,418" />);
    expect(screen.getByText('Total Attendance')).toBeInTheDocument();
    expect(screen.getByText('52,418')).toBeInTheDocument();
  });

  it('should render subtitle when provided', () => {
    render(
      <StatCard title="Total Attendance" value="52,418" subtitle="65.5% capacity" />
    );
    expect(screen.getByText('65.5% capacity')).toBeInTheDocument();
  });

  it('should render icon when provided', () => {
    const icon = <div data-testid="test-icon">Icon</div>;
    render(<StatCard title="Test" value="100" icon={icon} />);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should render trend when provided', () => {
    render(
      <StatCard
        title="Test"
        value="100"
        trend="up"
        trendValue="+12% from last hour"
      />
    );
    expect(screen.getByText('+12% from last hour')).toBeInTheDocument();
  });

  it('should show upward arrow for up trend', () => {
    render(
      <StatCard title="Test" value="100" trend="up" trendValue="+12%" />
    );
    expect(screen.getByText('↑')).toBeInTheDocument();
  });

  it('should show downward arrow for down trend', () => {
    render(
      <StatCard title="Test" value="100" trend="down" trendValue="-12%" />
    );
    expect(screen.getByText('↓')).toBeInTheDocument();
  });

  it('should show right arrow for neutral trend', () => {
    render(
      <StatCard title="Test" value="100" trend="neutral" trendValue="0%" />
    );
    expect(screen.getByText('→')).toBeInTheDocument();
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
