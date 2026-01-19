export const nextTaskPrompt = ({
  tasks,
}: {
  tasks: {
    title: string;
    status: string;
    lastContext?: string;
  }[];
}) => {
  return `
You are a productivity assistant.

Given the following tasks and their latest context,
decide which task the user should work on next.

Tasks:
${tasks
  .map(
    (t, i) =>
      `${i + 1}. ${t.title} [${t.status}]
Context: ${t.lastContext ?? "No context"}`,
  )
  .join("\n")}

Rules:
- Prefer IN_PROGRESS tasks
- Prefer tasks with recent context
- Suggest ONLY ONE task
- Respond in JSON with keys: title, reason
`;
};
