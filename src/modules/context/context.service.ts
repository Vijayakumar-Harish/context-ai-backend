import { prisma } from "../../plugins/prisma";

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
