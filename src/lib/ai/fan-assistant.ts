/* eslint-disable @typescript-eslint/no-explicit-any */
import { Facility, FanAssistantResponse, User } from "@/src/types";
import {
  CROWD_DATA,
  GATE_DATA,
  FACILITIES,
} from "@/src/lib/database/simulated-data";

export class FanAssistantService {
  async processQuery(
    userQuery: string,
    user: User,
  ): Promise<FanAssistantResponse> {
    const context = this.buildContext(user);
    const response = this.generateResponse(userQuery, context, user);
    return response;
  }

  private buildContext(user: User) {
    return {
      currentCrowdData: CROWD_DATA,
      gateData: GATE_DATA,
      facilities: FACILITIES,
      userPreferences: user.accessibilityPreferences,
    };
  }

  private generateResponse(
    query: string,
    context: any,
    user: User,
  ): FanAssistantResponse {
    const lowerQuery = query.toLowerCase();
    let navigationInstructions = "";
    let estimatedWalkingTime = 8;
    let crowdWarnings: string[] = [];
    let nearbyFacilities: Facility[] = [];
    let accessibilityNotes = "";

    if (lowerQuery.includes("gate c") && lowerQuery.includes("block 124")) {
      navigationInstructions =
        "Gate C is currently crowded. Use East Concourse Route B.";
      estimatedWalkingTime = 8;
      crowdWarnings.push("Gate C density: 85%");
      accessibilityNotes =
        "Nearest accessible elevator (Elevator E1) available 120 meters ahead on East Concourse.";
      nearbyFacilities = FACILITIES.filter((f) => f.type === "elevator");
    } else if (
      lowerQuery.includes("restroom") ||
      lowerQuery.includes("bathroom")
    ) {
      navigationInstructions =
        "Restrooms are available at Block 100, 2 minutes walk from your current location.";
      estimatedWalkingTime = 2;
      nearbyFacilities = FACILITIES.filter((f) => f.type === "restroom");
    } else if (lowerQuery.includes("food") || lowerQuery.includes("eat")) {
      navigationInstructions =
        "Food Court North is available with an 8-minute wait.";
      estimatedWalkingTime = 5;
      nearbyFacilities = FACILITIES.filter((f) => f.type === "food");
    } else if (
      lowerQuery.includes("first aid") ||
      lowerQuery.includes("medical")
    ) {
      navigationInstructions = "First Aid Station is near Gate A.";
      estimatedWalkingTime = 4;
      nearbyFacilities = FACILITIES.filter((f) => f.type === "first-aid");
    } else {
      navigationInstructions =
        "How can I assist you with your stadium experience today?";
    }

    return {
      navigationInstructions,
      estimatedWalkingTime,
      crowdWarnings,
      nearbyFacilities,
      accessibilityNotes,
      rawResponse: `${navigationInstructions}${crowdWarnings.length > 0 ? `\n\nWarnings: ${crowdWarnings.join(", ")}` : ""}${accessibilityNotes ? `\n\n${accessibilityNotes}` : ""}${estimatedWalkingTime ? `\n\nEstimated arrival: ${estimatedWalkingTime} minutes.` : ""}`,
    };
  }
}
