import { nextTaskPrompt } from "./ai.prompt";

// TEMP: mock AI response
export const getNextTaskFromAI = async (prompt: string) => {
  // Later: replace with OpenAI / local LLM
  return {
    title: "Continue previous task",
    reason: "You recently worked on this and it is still in progress",
  };
};
