import { prisma } from "../../plugins/prisma";
import { dailySummaryPrompt } from "../ai/summary.prompt";
import { generateDailySummaryAI } from "../ai/summary.service";

export const createContext = async (data: {
  content: string;
  source?: string;
  userId: string;
  taskId?: string;
}) => {
  return prisma.context.create({
    data,
  });
};

export const getTaskContext = async (taskId: string) => {
  return prisma.context.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
  });
};

export const getUserContext = async (userId: string) => {
  return prisma.context.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
};

export const getDailySummary = async (userId: string, date: Date) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const contexts = await prisma.context.findMany({
    where: {
      userId,
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    include: {
      task: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const summaryMap: Record<string, string[]> = {};

  for (const ctx of contexts) {
    const taskTitle = ctx.task?.title ?? "General";
    if (!summaryMap[taskTitle]) {
      summaryMap[taskTitle] = [];
    }
    summaryMap[taskTitle].push(ctx.content);
  }

  return Object.entries(summaryMap).map(([task, notes]) => ({
    task,
    progress: notes.join(" | "),
  }));
};



export const getDailySummaryWithAI = async (userId: string) => {
  const date = new Date().toISOString().split("T")[0];
  const baseSummary = await getDailySummary(userId, new Date());

  if (!baseSummary.length) return null;

  const prompt = dailySummaryPrompt({
    date,
    summaries: baseSummary,
  });

  return generateDailySummaryAI(prompt);
};

