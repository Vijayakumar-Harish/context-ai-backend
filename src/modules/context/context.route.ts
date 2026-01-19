import { FastifyInstance } from "fastify";
import {
  createContext,
  getDailySummary,
  getDailySummaryWithAI,
  getTaskContext,
} from "./context.service";
import { createContextSchema } from "./context.schema";
import { authGuard } from "../../plugins/auth";

export async function contextRoutes(app: FastifyInstance) {
  // Create context (authenticated)
  app.post("/context", { preHandler: authGuard }, async (req) => {
    const userId = (req as any).user.userId;
    const data = createContextSchema.parse(req.body);

    return createContext({
      ...data,
      userId,
    });
  });

  // Get context for a task
  app.get("/context/task/:taskId", { preHandler: authGuard }, async (req) => {
    const { taskId } = req.params as { taskId: string };
    return getTaskContext(taskId);
  });

  // Daily summary (rule-based)
  app.get("/context/daily-summary", { preHandler: authGuard }, async (req) => {
    const userId = (req as any).user.userId;
    return {
      date: new Date().toISOString().split("T")[0],
      summary: await getDailySummary(userId, new Date()),
    };
  });

  // Daily summary (AI)
  app.get(
    "/context/daily-summary-ai",
    { preHandler: authGuard },
    async (req) => {
      const userId = (req as any).user.userId;
      return getDailySummaryWithAI(userId);
    },
  );
}
