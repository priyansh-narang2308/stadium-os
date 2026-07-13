import { FanAssistantService } from "@/src/lib/ai/fan-assistant";
import {
  FanAssistantRequestSchema,
  FanAssistantResponseSchema,
} from "@/src/lib/validation/schemas";
import type { User } from "@/src/types";
import { createApiHandler } from "@/src/lib/api/handler";

const fanService = new FanAssistantService();

const DEFAULT_USER: User = {
  id: "anonymous",
  role: "fan",
  language: "en",
  accessibilityPreferences: {
    wheelchair: false,
    visualImpairment: false,
    hearingImpairment: false,
  },
};

export const POST = createApiHandler({
  name: "Fan Assistant",
  inputSchema: FanAssistantRequestSchema,
  outputSchema: FanAssistantResponseSchema,
  handler: async ({ query, user }) => {
    return fanService.processQuery(query, (user ?? DEFAULT_USER) as User);
  },
});
