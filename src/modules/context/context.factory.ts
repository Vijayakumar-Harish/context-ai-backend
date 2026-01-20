import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type ContextInput = {
  userId: string;
  taskId?: string;
  content: string;
  source?: "system" | "user" | "ai";
};

export async function createSystemContext(input: ContextInput) {
  return prisma.context.create({
    data: {
      userId: input.userId,
      taskId: input.taskId,
      content: input.content,
      source: input.source ?? "system",
    },
  });
}
