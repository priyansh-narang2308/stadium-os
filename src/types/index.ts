export type UserRole = "fan" | "operator" | "volunteer";

export interface AccessibilityPreferences {
  wheelchair: boolean;
  visualImpairment: boolean;
  hearingImpairment: boolean;
}

export interface User {
  id: string;
  role: UserRole;
  language: string;
  accessibilityPreferences?: AccessibilityPreferences;
}

export interface Stadium {
  id: string;
  name: string;
  location: string;
  capacity: number;
}

export type FacilityType =
  | "restroom"
  | "food"
  | "merchandise"
  | "first-aid"
  | "entrance"
  | "exit"
  | "elevator"
  | "escalator";

export interface Facility {
  id: string;
  stadiumId: string;
  type: FacilityType;
  name: string;
  location: string;
  accessibilityAvailable: boolean;
  currentWaitTime?: number;
}

export interface CrowdData {
  id: string;
  stadiumId: string;
  area: string;
  densityPercentage: number;
  timestamp: Date;
}

export interface GateData {
  id: string;
  stadiumId: string;
  gateName: string;
  queueLength: number;
  estimatedWaitTime: number;
  openLanes: number;
  timestamp: Date;
}

export interface WeatherData {
  stadiumId: string;
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "stormy";
  windSpeed: number;
}

export interface AIInteraction {
  id: string;
  userId: string;
  userRole: UserRole;
  prompt: string;
  response: string;
  createdAt: Date;
}

export interface FanAssistantResponse {
  navigationInstructions?: string;
  estimatedWalkingTime?: number;
  crowdWarnings?: string[];
  nearbyFacilities?: Facility[];
  accessibilityNotes?: string;
  rawResponse: string;
}

export type PriorityLevel = "low" | "medium" | "high" | "critical";

export interface OperationsRecommendation {
  recommendation: string;
  reasoning: string;
  expectedImpact: string;
  priority: PriorityLevel;
}

export interface VolunteerAssistantResponse {
  guidance: string;
  steps: string[];
  nearbyResources?: Facility[];
  emergencyContact?: string;
}
