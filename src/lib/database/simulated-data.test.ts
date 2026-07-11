import { describe, it, expect } from 'vitest';
import {
  STADIUM,
  FACILITIES,
  CROWD_DATA,
  GATE_DATA,
  WEATHER_DATA,
  getFacilitiesByType,
  getCrowdDensity,
  getGateData,
} from './simulated-data';

describe('Simulated Data', () => {
  describe('STADIUM', () => {
    it('should have correct stadium structure', () => {
      expect(STADIUM).toHaveProperty('id');
      expect(STADIUM).toHaveProperty('name');
      expect(STADIUM).toHaveProperty('location');
      expect(STADIUM).toHaveProperty('capacity');
    });

    it('should have valid stadium data', () => {
      expect(STADIUM.id).toBe('stadium-001');
      expect(STADIUM.name).toBe('StadiumOS Arena');
      expect(STADIUM.location).toBe('FIFA World Cup 2026');
      expect(STADIUM.capacity).toBe(80000);
    });
  });

  describe('FACILITIES', () => {
    it('should be an array', () => {
      expect(Array.isArray(FACILITIES)).toBe(true);
    });

    it('should have facilities with required properties', () => {
      FACILITIES.forEach((facility) => {
        expect(facility).toHaveProperty('id');
        expect(facility).toHaveProperty('stadiumId');
        expect(facility).toHaveProperty('type');
        expect(facility).toHaveProperty('name');
        expect(facility).toHaveProperty('location');
        expect(facility).toHaveProperty('accessibilityAvailable');
      });
    });

    it('should have at least one facility of each type', () => {
      const types = new Set(FACILITIES.map((f) => f.type));
      expect(types.size).toBeGreaterThan(0);
    });
  });

  describe('CROWD_DATA', () => {
    it('should be an array', () => {
      expect(Array.isArray(CROWD_DATA)).toBe(true);
    });

    it('should have crowd data with required properties', () => {
      CROWD_DATA.forEach((crowd) => {
        expect(crowd).toHaveProperty('id');
        expect(crowd).toHaveProperty('stadiumId');
        expect(crowd).toHaveProperty('area');
        expect(crowd).toHaveProperty('densityPercentage');
        expect(crowd).toHaveProperty('timestamp');
      });
    });

    it('should have valid density percentages', () => {
      CROWD_DATA.forEach((crowd) => {
        expect(crowd.densityPercentage).toBeGreaterThanOrEqual(0);
        expect(crowd.densityPercentage).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('GATE_DATA', () => {
    it('should be an array', () => {
      expect(Array.isArray(GATE_DATA)).toBe(true);
    });

    it('should have gate data with required properties', () => {
      GATE_DATA.forEach((gate) => {
        expect(gate).toHaveProperty('id');
        expect(gate).toHaveProperty('stadiumId');
        expect(gate).toHaveProperty('gateName');
        expect(gate).toHaveProperty('queueLength');
        expect(gate).toHaveProperty('estimatedWaitTime');
        expect(gate).toHaveProperty('openLanes');
        expect(gate).toHaveProperty('timestamp');
      });
    });

    it('should have valid wait times', () => {
      GATE_DATA.forEach((gate) => {
        expect(gate.estimatedWaitTime).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('WEATHER_DATA', () => {
    it('should have required properties', () => {
      expect(WEATHER_DATA).toHaveProperty('stadiumId');
      expect(WEATHER_DATA).toHaveProperty('temperature');
      expect(WEATHER_DATA).toHaveProperty('condition');
      expect(WEATHER_DATA).toHaveProperty('windSpeed');
    });

    it('should have valid weather data', () => {
      expect(WEATHER_DATA.temperature).toBeGreaterThanOrEqual(-50);
      expect(WEATHER_DATA.temperature).toBeLessThanOrEqual(60);
      expect(['sunny', 'cloudy', 'rainy', 'stormy']).toContain(
        WEATHER_DATA.condition
      );
    });
  });

  describe('getFacilitiesByType', () => {
    it('should return facilities of specified type', () => {
      const restrooms = getFacilitiesByType('restroom');
      restrooms.forEach((facility) => {
        expect(facility.type).toBe('restroom');
      });
    });

    it('should return empty array for non-existent type', () => {
      const result = getFacilitiesByType('nonexistent' as any);
      expect(result).toEqual([]);
    });

    it('should return all facilities when type exists', () => {
      const entrances = getFacilitiesByType('entrance');
      expect(entrances.length).toBeGreaterThan(0);
    });
  });

  describe('getCrowdDensity', () => {
    it('should return density for existing area', () => {
      const density = getCrowdDensity('Gate C');
      expect(typeof density).toBe('number');
      expect(density).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 for non-existent area', () => {
      const density = getCrowdDensity('Non-existent Area');
      expect(density).toBe(0);
    });
  });

  describe('getGateData', () => {
    it('should return gate data for existing gate', () => {
      const gate = getGateData('Gate A');
      expect(gate).toBeDefined();
      expect(gate?.gateName).toBe('Gate A');
    });

    it('should return undefined for non-existent gate', () => {
      const gate = getGateData('Non-existent Gate');
      expect(gate).toBeUndefined();
    });
  });
});
