import { FastifyInstance } from "fastify";
import {
  createTask,
  getLastWorkingContext,
  getNextTasks,
  getSmartNextTask,
  listTasks,
  startTask,
} from "./task.service";
import { createTaskSchema } from "./task.schema";
import { authGuard } from "../../plugins/auth";

export async function taskRoutes(app: FastifyInstance) {
  app.post("/tasks", { preHandler: authGuard }, async (req) => {
    const data = createTaskSchema.parse(req.body);

    const userId = (req as any).user.userId; // "u1"

    return createTask({
      ...data,
      userId,
    });
  });

  app.get("/tasks", { preHandler: authGuard }, async (req) => {
    return listTasks((req as any).user.userId);
  });

  app.get("/tasks/next", { preHandler: authGuard }, async (req) => {
    return getNextTasks((req as any).user.userId);
  });

  app.get("/tasks/next-ai", { preHandler: authGuard }, async (req) => {
    return getSmartNextTask((req as any).user.userId);
  });

  app.get("/tasks/restore", { preHandler: authGuard }, async (req) => {
    const userId = (req as any).user.userId;
    return getLastWorkingContext(userId);
  });
app.post("/tasks/:id/start", { preHandler: authGuard }, async (req) => {
  const { id } = req.params as { id: string };
  const userId = req.user!.userId;

  await startTask(id, userId);
  return { success: true };
});
}
