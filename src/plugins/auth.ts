import { FastifyInstance, FastifyRequest } from "fastify";
import { verifyToken } from "../modules/auth/jwt";

export const authPlugin = async (app: FastifyInstance) => {
  app.addHook("preValidation", async (req: FastifyRequest) => {
    // Ignore preflight
    if (req.method === "OPTIONS") return;

    const auth = req.headers.authorization;
    if (!auth) return;

    try {
      const token = auth.replace("Bearer ", "");
      (req as any).user = verifyToken(token);
    } catch {
      // invalid token → ignore
    }
  });
};

export const authGuard = async (req: FastifyRequest) => {
  if (!(req as any).user) {
    const err: any = new Error("Unauthorized");
    err.statusCode = 401;
    throw err;
  }
};
