export const dailySummaryPrompt = ({
  date,
  summaries,
}: {
  date: string;
  summaries: { task: string; progress: string }[];
}) => {
  return `
You are a productivity assistant.

Rewrite the following work log into a clear, concise daily summary
that sounds natural and professional.

Date: ${date}

Work done:
${summaries
  .map((s, i) => `${i + 1}. Task: ${s.task}\n   Notes: ${s.progress}`)
  .join("\n")}

Rules:
- Be concise
- Do NOT invent new work
- Use simple professional language
- 4–6 sentences max
`;
};
