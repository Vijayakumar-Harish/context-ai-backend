import { FastifyInstance } from "fastify";
import { requestMagicLink, verifyMagicLink } from "./auth.service";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (req) => {
    const { email } = req.body as { email: string };
    return requestMagicLink(email);
  });

  app.get("/auth/verify", async (req) => {
    const { token } = req.query as { token: string };
    return verifyMagicLink(token);
  });
}
