import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding dev data...");

  // 1️⃣ User (must match JWT.userId)
  const user = await prisma.user.upsert({
    where: { id: "u1" },
    update: {},
    create: {
      id: "u1",
      email: "test@context.ai",
    },
  });

  // 2️⃣ Tasks
  const task1 = await prisma.task.create({
    data: {
      title: "Build authentication flow",
      description: "JWT + Fastify auth",
      status: "IN_PROGRESS",
      userId: user.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "Design task restore logic",
      status: "PENDING",
      userId: user.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "AI daily summary",
      status: "DONE",
      userId: user.id,
    },
  });

  // 3️⃣ Contexts
  await prisma.context.createMany({
    data: [
      {
        content: "Started implementing JWT auth with Fastify",
        source: "manual",
        userId: user.id,
        taskId: task1.id,
      },
      {
        content: "Thinking about restore flow UX",
        source: "manual",
        userId: user.id,
        taskId: task2.id,
      },
      {
        content: "AI summary logic finalized",
        source: "manual",
        userId: user.id,
        taskId: task3.id,
      },
    ],
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
