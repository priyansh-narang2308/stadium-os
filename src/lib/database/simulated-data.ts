import { Stadium, Facility, CrowdData, GateData, WeatherData, FacilityType } from '@/src/types';

export const STADIUM: Stadium = {
  id: 'stadium-001',
  name: 'StadiumOS Arena',
  location: 'FIFA World Cup 2026',
  capacity: 80000
};

export const FACILITIES: Facility[] = [
  { id: 'fac-001', stadiumId: 'stadium-001', type: 'entrance', name: 'Gate A', location: 'North Side', accessibilityAvailable: true, currentWaitTime: 12 },
  { id: 'fac-002', stadiumId: 'stadium-001', type: 'entrance', name: 'Gate B', location: 'North East', accessibilityAvailable: true, currentWaitTime: 5 },
  { id: 'fac-003', stadiumId: 'stadium-001', type: 'entrance', name: 'Gate C', location: 'East Side', accessibilityAvailable: true, currentWaitTime: 20 },
  { id: 'fac-004', stadiumId: 'stadium-001', type: 'restroom', name: 'Restroom Block 100', location: 'Block 100', accessibilityAvailable: true },
  { id: 'fac-005', stadiumId: 'stadium-001', type: 'food', name: 'Food Court North', location: 'North Concourse', accessibilityAvailable: true, currentWaitTime: 8 },
  { id: 'fac-006', stadiumId: 'stadium-001', type: 'first-aid', name: 'First Aid Station', location: 'Near Gate A', accessibilityAvailable: true },
  { id: 'fac-007', stadiumId: 'stadium-001', type: 'elevator', name: 'Elevator E1', location: 'East Concourse', accessibilityAvailable: true },
  { id: 'fac-008', stadiumId: 'stadium-001', type: 'elevator', name: 'Elevator E2', location: 'West Concourse', accessibilityAvailable: true },
];

export const CROWD_DATA: CrowdData[] = [
  { id: 'crowd-001', stadiumId: 'stadium-001', area: 'Gate C', densityPercentage: 85, timestamp: new Date() },
  { id: 'crowd-002', stadiumId: 'stadium-001', area: 'East Concourse', densityPercentage: 45, timestamp: new Date() },
  { id: 'crowd-003', stadiumId: 'stadium-001', area: 'West Concourse', densityPercentage: 50, timestamp: new Date() },
  { id: 'crowd-004', stadiumId: 'stadium-001', area: 'Block 124', densityPercentage: 30, timestamp: new Date() },
];

export const GATE_DATA: GateData[] = [
  { id: 'gate-001', stadiumId: 'stadium-001', gateName: 'Gate A', queueLength: 45, estimatedWaitTime: 12, openLanes: 3, timestamp: new Date() },
  { id: 'gate-002', stadiumId: 'stadium-001', gateName: 'Gate B', queueLength: 15, estimatedWaitTime: 5, openLanes: 2, timestamp: new Date() },
  { id: 'gate-003', stadiumId: 'stadium-001', gateName: 'Gate C', queueLength: 80, estimatedWaitTime: 20, openLanes: 2, timestamp: new Date() },
];

export const WEATHER_DATA: WeatherData = {
  stadiumId: 'stadium-001',
  temperature: 24,
  condition: 'sunny',
  windSpeed: 8
};

export const getFacilitiesByType = (type: FacilityType): Facility[] => {
  return FACILITIES.filter(f => f.type === type);
};

export const getCrowdDensity = (area: string): number => {
  const data = CROWD_DATA.find(c => c.area === area);
  return data ? data.densityPercentage : 0;
};

export const getGateData = (gateName: string): GateData | undefined => {
  return GATE_DATA.find(g => g.gateName === gateName);
};
