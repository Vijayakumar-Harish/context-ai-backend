import { prisma } from "../../plugins/prisma";

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
