import { FastifyInstance } from "fastify";
import { createTask, getLastWorkingContext, getNextTasks, getSmartNextTask, listTasks } from "./task.service";
import { createTaskSchema } from "./task.schema";

export async function taskRoutes(app: FastifyInstance) {
  app.post("/tasks", async (req) => {
    const data = createTaskSchema.parse(req.body);
    return createTask(data);
  });

  app.get("/tasks/:userId", async (req) => {
    const { userId } = req.params as { userId: string };
    return listTasks(userId);
  });

  app.get("/tasks/next/:userId", async (req) => {
    const { userId } = req.params as { userId: string };
    return getNextTasks(userId);
  });

  app.get("/tasks/next-ai/:userId", async (req) => {
    const { userId } = req.params as { userId: string };
    return getSmartNextTask(userId);
  });

  app.get("/tasks/restore/:userId", async (req) => {
    const { userId } = req.params as { userId: string };
    return getLastWorkingContext(userId);
  });

}
