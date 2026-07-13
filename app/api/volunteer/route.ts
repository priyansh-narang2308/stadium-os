import { VolunteerAssistantService } from "@/src/lib/ai/volunteer-assistant";
import {
  VolunteerRequestSchema,
  VolunteerAssistantResponseSchema,
} from "@/src/lib/validation/schemas";
import { createApiHandler } from "@/src/lib/api/handler";

const volunteerService = new VolunteerAssistantService();

export const POST = createApiHandler({
  name: "Volunteer",
  inputSchema: VolunteerRequestSchema,
  outputSchema: VolunteerAssistantResponseSchema,
  handler: async ({ query }) => {
    return volunteerService.getGuidance(query);
  },
});
