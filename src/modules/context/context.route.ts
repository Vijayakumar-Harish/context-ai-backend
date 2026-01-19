import { FastifyInstance } from "fastify";
import {
  createContext,
  getDailySummary,
  getDailySummaryWithAI,
  getTaskContext,
  getUserContext,
} from "./context.service";
import { createContextSchema } from "./context.schema";

export async function contextRoutes(app: FastifyInstance) {
  app.post("/context", async (req) => {
    const data = createContextSchema.parse(req.body);
    return createContext(data);
  });

  app.get("/context/task/:taskId", async (req) => {
    const { taskId } = req.params as { taskId: string };
    return getTaskContext(taskId);
  });

  app.get("/context/user/:userId", async (req) => {
    const { userId } = req.params as { userId: string };
    return getUserContext(userId);
  });

  app.get("/context/daily-summary/:userId", async (req) => {
    const { userId } = req.params as { userId: string };
    return {
      date: new Date().toISOString().split("T")[0],
      summary: await getDailySummary(userId, new Date()),
    };
  });

  app.get("/context/daily-summary-ai/:userId", async (req) => {
    const { userId } = req.params as { userId: string };
    return getDailySummaryWithAI(userId);
  });


}
