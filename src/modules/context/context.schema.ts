import { z } from "zod";

export const createContextSchema = z.object({
  content: z.string().min(1),
  source: z.enum(["manual", "system", "ai"]).optional(),
  userId: z.string(),
  taskId: z.string().optional(),
});
