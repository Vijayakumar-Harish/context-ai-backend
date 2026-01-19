import { prisma } from "../../plugins/prisma";
import { getNextTaskFromAI } from "../ai/ai.service";
import { nextTaskPrompt } from "../ai/ai.prompt";

export const createTask = async (data: {
  title: string;
  description?: string;
  userId: string;
}) => {
  return prisma.task.create({ data });
};

export const listTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getNextTasks = async (userId: string) => {
  return prisma.task.findMany({
    where: {
      userId,
      status: {
        not: "DONE",
      },
    },
    include: {
      contexts: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: [
      { status: "asc" }, // IN_PROGRESS first
      { updatedAt: "desc" }, // recently touched
    ],
    take: 3,
  });
};



export const getSmartNextTask = async (userId: string) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
      status: { not: "DONE" },
    },
    include: {
      contexts: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: [{ updatedAt: "desc" }],
    take: 5,
  });

  if (!tasks.length) return null;

  const prompt = nextTaskPrompt({
    tasks: tasks.map((t) => ({
      title: t.title,
      status: t.status,
      lastContext: t.contexts[0]?.content,
    })),
  });

  return getNextTaskFromAI(prompt);
};

