import { TargetAudience } from "@/db/projects";
import { ChatEntry, Project } from "@/db/schema";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function generateChatEntry(
  persona: TargetAudience & { avatar: string },
  currentChat: ChatEntry[],
  messagesLeft: number
): Promise<ChatEntry> {
  const chatHistoryText = currentChat
    .map((entry) => `${entry.name}: ${entry.message}`)
    .join("\n"); // Keep name for context, but instruct AI not to tag

  const chatEntry = await generateObject({
    model: openai("gpt-4o"),
    prompt: `You are ${persona.name}, a ${persona.age}-year-old ${
      persona.gender
    } from ${persona.country} (${persona.ethnicity}). You live in ${
      persona.location
    } and your interests include ${persona.interests.join(
      ", "
    )}. Your main needs are ${persona.needs.join(", ")}.

The current discussion is about a new project idea. Here is the conversation history so far:
${chatHistoryText}

Your task: Respond naturally as ${
      persona.name
    }, continuing the conversation. Keep your message concise (1-2 sentences). Do NOT greet anyone or use @ mentions/tags. Reflect your persona's characteristics, interests, and needs in your response.

There are only ${messagesLeft} messages left in this discussion, so keep that in mind. Aim for a natural conversational flow towards a conclusion if appropriate. Write only your message content.`,
    schema: z.object({
      message: z.string(),
    }),
  });

  return {
    ...chatEntry.object,
    name: persona.name,
    avatar: persona.avatar,
    id: randomUUID(),
    createdAt: new Date(),
  };
}
