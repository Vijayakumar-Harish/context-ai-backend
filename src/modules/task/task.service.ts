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
