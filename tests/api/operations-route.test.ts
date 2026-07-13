import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/src/lib/ai/operations-assistant', () => {
  const mockAnalyzeOperations = vi.fn().mockResolvedValue([
    { severity: 'low', message: 'Gate C wait times are manageable', timestamp: new Date('2026-07-15T18:00:00Z') },
  ]);
  const mockGetDashboardData = vi.fn().mockReturnValue({
    stadiumStatus: 'operational',
    occupancyRate: 45,
    recommendationCount: 1,
  });
  return {
    OperationsAssistantService: vi.fn().mockImplementation(() => ({
      analyzeOperations: mockAnalyzeOperations,
      getDashboardData: mockGetDashboardData,
    })),
  };
});

vi.mock('@/src/lib/security/middleware', async () => {
  const actual = await vi.importActual('@/src/lib/security/middleware');
  return {
    ...actual as Record<string, unknown>,
    rateLimit: vi.fn().mockResolvedValue({ allowed: true }),
    getRateLimitHeaders: vi.fn().mockResolvedValue({}),
  };
});

describe('Operations API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return dashboard data via GET', async () => {
    const { GET } = await import('@/app/api/operations/route');
    const request = new NextRequest('http://localhost:3000/api/operations');
    const response = await GET(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('stadiumStatus', 'operational');
    expect(body).toHaveProperty('occupancyRate');
  });

  it('should analyze operations via POST', async () => {
    const { POST } = await import('@/app/api/operations/route');
    const request = new NextRequest('http://localhost:3000/api/operations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input: 'Check Gate A traffic' }),
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('recommendations');
    expect(body).toHaveProperty('dashboardData');
  });

  it('should return 429 when rate limited', async () => {
    const middleware = await import('@/src/lib/security/middleware');
    vi.mocked(middleware.rateLimit).mockResolvedValueOnce({ allowed: false, remaining: 0, resetTime: Date.now() + 60000 });

    const { GET } = await import('@/app/api/operations/route');
    const request = new NextRequest('http://localhost:3000/api/operations');
    const response = await GET(request);
    expect(response.status).toBe(429);
  });
});
