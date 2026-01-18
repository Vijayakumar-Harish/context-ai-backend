import { FastifyInstance } from "fastify";
import {
  createContext,
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
}
