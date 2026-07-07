import { VolunteerAssistantResponse, User } from "@/src/types";
import { FACILITIES } from "@/src/lib/database/simulated-data";

export class VolunteerAssistantService {
  async getGuidance(
    volunteerQuery: string,
    volunteer: User,
  ): Promise<VolunteerAssistantResponse> {
    const lowerQuery = volunteerQuery.toLowerCase();
    let guidance = "";
    let steps: string[] = [];
    let nearbyResources: any[] = [];

    if (lowerQuery.includes("wheelchair")) {
      guidance = "Guide wheelchair users to the nearest accessible elevator.";
      steps = [
        "Direct fan to Elevator E1 (East Concourse) or E2 (West Concourse)",
        "Ensure the path is clear of obstacles",
        "Assist with elevator operation if needed",
        "Escort to designated accessible seating area",
      ];
      nearbyResources = FACILITIES.filter((f) => f.type === "elevator");
    } else if (
      lowerQuery.includes("emergency") ||
      lowerQuery.includes("evacuation")
    ) {
      guidance = "Follow emergency evacuation procedures immediately.";
      steps = [
        "Stay calm and direct fans to nearest exit",
        "Avoid elevators - use stairs",
        "Assist fans with disabilities",
        "Gather at designated assembly points outside stadium",
      ];
    } else if (lowerQuery.includes("lost") || lowerQuery.includes("child")) {
      guidance = "Lost child protocol activation.";
      steps = [
        "Notify stadium security immediately",
        "Take the child to the nearest information desk",
        "Gather identifying information",
        "Stay with the child until parents/guardians arrive",
      ];
    } else {
      guidance = "How can I help you assist fans today?";
      steps = [
        "Greet the fan politely",
        "Listen carefully to their question",
        "Provide clear directions",
        "Offer additional assistance if needed",
      ];
    }

    return {
      guidance,
      steps,
      nearbyResources,
      emergencyContact: "Stadium Security: +1 (555) 123-4567",
    };
  }
}
