import Fastify from "fastify";
import cors from "@fastify/cors";
import { taskRoutes } from "./modules/task/task.route";
import { contextRoutes } from "./modules/context/context.route";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  app.register(cors);
  app.register(taskRoutes);
  app.register(contextRoutes);
  app.get("/health", async () => {
    return { status: "ok" };
  });

  return app;
};
