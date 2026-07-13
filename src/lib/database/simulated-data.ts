import { Stadium, Facility, CrowdData, GateData, WeatherData, FacilityType, MatchEvent, SecurityAlert } from '@/src/types';

export const STADIUM: Stadium = {
  id: 'stadium-001',
  name: 'MetLife Stadium',
  location: 'East Rutherford, New Jersey, USA',
  capacity: 82500,
};

export const MATCHES: MatchEvent[] = [
  {
    id: 'match-001',
    stadiumId: 'stadium-001',
    homeTeam: 'Brazil',
    awayTeam: 'Germany',
    date: new Date('2026-07-15T20:00:00Z'),
    phase: 'Group Stage',
    estimatedAttendance: 78500,
    status: 'upcoming',
  },
  {
    id: 'match-002',
    stadiumId: 'stadium-001',
    homeTeam: 'Argentina',
    awayTeam: 'France',
    date: new Date('2026-07-18T21:00:00Z'),
    phase: 'Round of 16',
    estimatedAttendance: 81000,
    status: 'upcoming',
  },
  {
    id: 'match-003',
    stadiumId: 'stadium-001',
    homeTeam: 'England',
    awayTeam: 'Spain',
    date: new Date('2026-07-22T20:00:00Z'),
    phase: 'Quarter Final',
    estimatedAttendance: 82000,
    status: 'upcoming',
  },
];

export const FACILITIES: Facility[] = [
  { id: 'fac-001', stadiumId: 'stadium-001', type: 'entrance', name: 'Gate A - VIP', location: 'North Side', accessibilityAvailable: true, currentWaitTime: 3 },
  { id: 'fac-002', stadiumId: 'stadium-001', type: 'entrance', name: 'Gate B - General Admission', location: 'North East', accessibilityAvailable: true, currentWaitTime: 8 },
  { id: 'fac-003', stadiumId: 'stadium-001', type: 'entrance', name: 'Gate C - General Admission', location: 'East Side', accessibilityAvailable: true, currentWaitTime: 20 },
  { id: 'fac-004', stadiumId: 'stadium-001', type: 'entrance', name: 'Gate D - Family & Accessibility', location: 'West Side', accessibilityAvailable: true, currentWaitTime: 5 },
  { id: 'fac-005', stadiumId: 'stadium-001', type: 'entrance', name: 'Gate E - Season Ticket Holders', location: 'South Side', accessibilityAvailable: true, currentWaitTime: 2 },
  { id: 'fac-006', stadiumId: 'stadium-001', type: 'restroom', name: 'Restroom Block 100', location: 'Block 100 - North Stand', accessibilityAvailable: true },
  { id: 'fac-007', stadiumId: 'stadium-001', type: 'restroom', name: 'Restroom Block 200', location: 'Block 200 - East Stand', accessibilityAvailable: true },
  { id: 'fac-008', stadiumId: 'stadium-001', type: 'restroom', name: 'Restroom Block 300', location: 'Block 300 - Family Zone', accessibilityAvailable: true },
  { id: 'fac-009', stadiumId: 'stadium-001', type: 'restroom', name: 'Restroom Block 400', location: 'Block 400 - West Stand', accessibilityAvailable: true },
  { id: 'fac-010', stadiumId: 'stadium-001', type: 'restroom', name: 'Accessible Restroom', location: 'Ground Floor - Near Gate D', accessibilityAvailable: true },
  { id: 'fac-011', stadiumId: 'stadium-001', type: 'food', name: 'Food Court North', location: 'North Concourse', accessibilityAvailable: true, currentWaitTime: 10 },
  { id: 'fac-012', stadiumId: 'stadium-001', type: 'food', name: 'Food Court South', location: 'South Concourse', accessibilityAvailable: true, currentWaitTime: 15 },
  { id: 'fac-013', stadiumId: 'stadium-001', type: 'food', name: 'Premium Lounge Grill', location: 'VIP Level 2', accessibilityAvailable: true, currentWaitTime: 5 },
  { id: 'fac-014', stadiumId: 'stadium-001', type: 'food', name: 'East Wing Concessions', location: 'East Concourse', accessibilityAvailable: true, currentWaitTime: 8 },
  { id: 'fac-015', stadiumId: 'stadium-001', type: 'first-aid', name: 'First Aid Station - Main', location: 'Near Gate A', accessibilityAvailable: true },
  { id: 'fac-016', stadiumId: 'stadium-001', type: 'first-aid', name: 'First Aid Station - East', location: 'Block 200 Concourse', accessibilityAvailable: true },
  { id: 'fac-017', stadiumId: 'stadium-001', type: 'elevator', name: 'Elevator E1 - North Tower', location: 'North Concourse', accessibilityAvailable: true },
  { id: 'fac-018', stadiumId: 'stadium-001', type: 'elevator', name: 'Elevator E2 - West Tower', location: 'West Concourse', accessibilityAvailable: true },
  { id: 'fac-019', stadiumId: 'stadium-001', type: 'elevator', name: 'Elevator E3 - East Tower', location: 'East Concourse', accessibilityAvailable: true },
  { id: 'fac-020', stadiumId: 'stadium-001', type: 'elevator', name: 'Elevator E4 - South Tower', location: 'South Concourse', accessibilityAvailable: true },
  { id: 'fac-021', stadiumId: 'stadium-001', type: 'parking', name: 'Parking Lot P1 - VIP', location: 'North Entrance', accessibilityAvailable: true, totalSpots: 500, availableSpots: 120 },
  { id: 'fac-022', stadiumId: 'stadium-001', type: 'parking', name: 'Parking Lot P2 - General', location: 'East Entrance', accessibilityAvailable: true, totalSpots: 1500, availableSpots: 400 },
  { id: 'fac-023', stadiumId: 'stadium-001', type: 'parking', name: 'Parking Lot P3 - Accessible', location: 'West Entrance', accessibilityAvailable: true, totalSpots: 200, availableSpots: 85 },
  { id: 'fac-024', stadiumId: 'stadium-001', type: 'ticket-booth', name: 'Ticket Booth North', location: 'North Plaza', accessibilityAvailable: true, currentWaitTime: 12 },
  { id: 'fac-025', stadiumId: 'stadium-001', type: 'ticket-booth', name: 'Ticket Booth East', location: 'East Plaza', accessibilityAvailable: true, currentWaitTime: 25 },
  { id: 'fac-026', stadiumId: 'stadium-001', type: 'merchandise', name: 'Official Fan Shop', location: 'Main Concourse', accessibilityAvailable: true, currentWaitTime: 7 },
  { id: 'fac-027', stadiumId: 'stadium-001', type: 'fan-zone', name: 'Interactive Fan Zone', location: 'South Plaza', accessibilityAvailable: true, currentWaitTime: 15 },
];

export const CROWD_DATA: CrowdData[] = [
  { id: 'crowd-001', stadiumId: 'stadium-001', area: 'Gate C - East Entry Plaza', densityPercentage: 88, timestamp: new Date(), trend: 'increasing' },
  { id: 'crowd-002', stadiumId: 'stadium-001', area: 'East Concourse', densityPercentage: 55, timestamp: new Date(), trend: 'stable' },
  { id: 'crowd-003', stadiumId: 'stadium-001', area: 'West Concourse', densityPercentage: 42, timestamp: new Date(), trend: 'stable' },
  { id: 'crowd-004', stadiumId: 'stadium-001', area: 'North Concourse', densityPercentage: 65, timestamp: new Date(), trend: 'increasing' },
  { id: 'crowd-005', stadiumId: 'stadium-001', area: 'South Plaza - Fan Zone', densityPercentage: 78, timestamp: new Date(), trend: 'increasing' },
  { id: 'crowd-006', stadiumId: 'stadium-001', area: 'Block 124 - North Stand', densityPercentage: 35, timestamp: new Date(), trend: 'stable' },
  { id: 'crowd-007', stadiumId: 'stadium-001', area: 'Block 210 - East Stand Upper', densityPercentage: 45, timestamp: new Date(), trend: 'decreasing' },
  { id: 'crowd-008', stadiumId: 'stadium-001', area: 'VIP Level 2', densityPercentage: 25, timestamp: new Date(), trend: 'stable' },
  { id: 'crowd-009', stadiumId: 'stadium-001', area: 'Main Entry Plaza', densityPercentage: 92, timestamp: new Date(), trend: 'increasing' },
  { id: 'crowd-010', stadiumId: 'stadium-001', area: 'Parking Lot P2', densityPercentage: 70, timestamp: new Date(), trend: 'increasing' },
];

export const GATE_DATA: GateData[] = [
  { id: 'gate-001', stadiumId: 'stadium-001', gateName: 'Gate A - VIP', queueLength: 12, estimatedWaitTime: 3, openLanes: 4, timestamp: new Date() },
  { id: 'gate-002', stadiumId: 'stadium-001', gateName: 'Gate B - General', queueLength: 45, estimatedWaitTime: 8, openLanes: 6, timestamp: new Date() },
  { id: 'gate-003', stadiumId: 'stadium-001', gateName: 'Gate C - General', queueLength: 120, estimatedWaitTime: 20, openLanes: 4, timestamp: new Date() },
  { id: 'gate-004', stadiumId: 'stadium-001', gateName: 'Gate D - Family', queueLength: 18, estimatedWaitTime: 5, openLanes: 3, timestamp: new Date() },
  { id: 'gate-005', stadiumId: 'stadium-001', gateName: 'Gate E - Season', queueLength: 8, estimatedWaitTime: 2, openLanes: 3, timestamp: new Date() },
];

export const WEATHER_DATA: WeatherData = {
  stadiumId: 'stadium-001',
  temperature: 26,
  condition: 'partly-cloudy',
  windSpeed: 12,
  humidity: 55,
  precipitation: 10,
};

export const SECURITY_ALERTS: SecurityAlert[] = [
  { id: 'alert-001', stadiumId: 'stadium-001', severity: 'low', type: 'suspicious-package', area: 'Gate C', description: 'Unattended backpack reported', timestamp: new Date(), status: 'resolved' },
  { id: 'alert-002', stadiumId: 'stadium-001', severity: 'info', type: 'crowd-warning', area: 'South Plaza', description: 'Crowd density reaching critical level at Fan Zone', timestamp: new Date(), status: 'active' },
  { id: 'alert-003', stadiumId: 'stadium-001', severity: 'info', type: 'accessibility', area: 'Gate D', description: 'Wheelchair escort requested', timestamp: new Date(), status: 'resolved' },
];

export const getFacilitiesByType = (type: FacilityType): Facility[] => {
  return FACILITIES.filter(f => f.type === type);
};

export const getFacilitiesByArea = (area: string): Facility[] => {
  return FACILITIES.filter(f =>
    f.location.toLowerCase().includes(area.toLowerCase())
  );
};

export const getAccessibleFacilities = (): Facility[] => {
  return FACILITIES.filter(f => f.accessibilityAvailable);
};

export const getCrowdDensity = (area: string): number => {
  const data = CROWD_DATA.find(c => c.area === area);
  return data ? data.densityPercentage : 0;
};

export const getHighDensityAreas = (threshold: number = 75): CrowdData[] => {
  return CROWD_DATA.filter(c => c.densityPercentage >= threshold);
};

export const getGateData = (gateName: string): GateData | undefined => {
  return GATE_DATA.find(g => g.gateName === gateName);
};

export const getShortestWaitGate = (): GateData | undefined => {
  return GATE_DATA.reduce((best, current) =>
    current.estimatedWaitTime < (best?.estimatedWaitTime ?? Infinity) ? current : best
  , undefined as GateData | undefined);
};

export const getUpcomingMatches = (): MatchEvent[] => {
  return MATCHES.filter(m => m.status === 'upcoming');
};

export const getActiveSecurityAlerts = (): SecurityAlert[] => {
  return SECURITY_ALERTS.filter(a => a.status === 'active' || a.status === 'investigating');
};

export const getAlertsBySeverity = (severity: SecurityAlert['severity']): SecurityAlert[] => {
  return SECURITY_ALERTS.filter(a => a.severity === severity);
};
