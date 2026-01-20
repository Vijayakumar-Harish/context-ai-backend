import type {} from "./@types/fastify";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { taskRoutes } from "./modules/task/task.route";
import { contextRoutes } from "./modules/context/context.route";
import { authRoutes } from "./modules/auth/auth.route";
import { verifyToken } from "./modules/auth/jwt";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // ✅ GLOBAL AUTH HOOK (NO encapsulation issues)
  app.addHook("onRequest", async (req) => {
    const auth = req.headers.authorization;
    if (!auth) return;

    try {
      const token = auth.replace("Bearer ", "");
      (req as any).user = verifyToken(token);
    } catch {
      // invalid token → ignore
    }
  });

  app.register(authRoutes);
  app.register(taskRoutes);
  app.register(contextRoutes);

  app.get("/health", async () => ({ status: "ok" }));

  return app;
};
