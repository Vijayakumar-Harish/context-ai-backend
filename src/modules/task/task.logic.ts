import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function restoreTask(userId: string) {
  // 1️⃣ Active task
  const active = await prisma.task.findFirst({
    where: { userId, status: "IN_PROGRESS" },
    orderBy: { updatedAt: "desc" },
  });

  if (active) return active;

  // 2️⃣ Last context task
  const lastContext = await prisma.context.findFirst({
    where: { userId, taskId: { not: null } },
    orderBy: { createdAt: "desc" },
    include: { task: true },
  });

  if (lastContext?.task) return lastContext.task;

  // 3️⃣ Fallback pending
  return prisma.task.findFirst({
    where: { userId, status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });
}

export async function getNextTask(userId: string) {
  const inProgress = await prisma.task.findFirst({
    where: { userId, status: "IN_PROGRESS" },
    orderBy: { updatedAt: "asc" },
  });

  if (inProgress) return inProgress;

  return prisma.task.findFirst({
    where: { userId, status: "PENDING" },
    orderBy: { createdAt: "asc" },
  });
}
