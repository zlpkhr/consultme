import { generateChatEntry } from "@/ai/chat";
import { getProject, TargetAudience, updateProjectChat } from "@/db/projects";
import { ChatEntry } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { TextEncoder } from "node:util";

const MAX_MESSAGES = 21;

// Changed from POST to GET for SSE
export async function GET(request: NextRequest) {
  const projectId = request.nextUrl.searchParams.get("id");

  if (!projectId) {
    return new Response("Project ID is required", { status: 400 });
  }

  const project = await getProject(projectId);

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  // Ensure target audience exists and is an array
  const personas = project.targetAudience as TargetAudience[] | null;
  if (!personas || !Array.isArray(personas) || personas.length === 0) {
    return new Response("Project target audience is not defined or empty", {
      status: 400,
    });
  }

  // Get existing chat or initialize
  const chatHistory: ChatEntry[] = project.chat ?? [
    {
      id: randomUUID(),
      createdAt: new Date(),
      name: "Moderator",
      message: `Welcome to the discussion about ${project.name}! Let's explore the project details together. The current product description is: ${project.productDescription}. We'll be discussing this with you to gather valuable insights. What are your thoughts on this?`,
      avatar: "/moderator.png",
    },
  ];

  // Check if chat is already full
  if (chatHistory.length >= MAX_MESSAGES) {
    // If chat is complete, return the full history as JSON
    return NextResponse.json(chatHistory, { status: 200 });
  }

  // Create a transform stream for SSE
  let streamController: ReadableStreamDefaultController<Uint8Array>;
  let aborted = false;

  const stream = new ReadableStream({
    async start(controller) {
      streamController = controller;
      const encoder = new TextEncoder();

      // Function to send a chat message via SSE
      const sendChatMessage = (entry: ChatEntry) => {
        if (aborted) return;
        const message = `data: ${JSON.stringify(entry)}\n\n`;
        try {
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          // Handle potential errors if the controller is closed unexpectedly
          console.error("Error enqueuing message:", error);
          aborted = true; // Stop further processing
        }
      };

      // Send existing chat history first
      console.log(`Sending initial ${chatHistory.length} chat entries...`);
      for (const entry of chatHistory) {
        sendChatMessage(entry);
      }

      // Function to generate, send, and persist messages
      const generateAndSend = async () => {
        try {
          // Start generating *after* the initial history has been sent
          let currentMessageCount = chatHistory.length;
          while (currentMessageCount < MAX_MESSAGES && !aborted) {
            // Determine the next persona
            const personaIndex = currentMessageCount % personas.length;
            const currentPersona = personas[personaIndex];

            // Calculate messages left
            const messagesLeft = MAX_MESSAGES - currentMessageCount;

            // Generate the next chat entry
            const newEntry = await generateChatEntry(
              currentPersona,
              chatHistory,
              messagesLeft
            );

            // Add to local history
            chatHistory.push(newEntry);
            currentMessageCount++;

            // Send message to client
            sendChatMessage(newEntry);

            // Persist the updated chat history (async, don't wait)
            updateProjectChat(projectId, [...chatHistory]).catch((err) => {
              console.error("Failed to update chat history:", err);
              // Optional: handle persistence error (e.g., notify client, stop stream)
            });
          }
        } catch (error) {
          console.error("Error during chat generation:", error);
          if (!aborted) {
            controller.error(error); // Signal error to the client
          }
        } finally {
          if (!aborted) {
            console.log("Reached message limit or finished generation.");
            controller.close(); // Close the stream gracefully
          }
        }
      };

      // Start generation
      generateAndSend();
    },
    cancel(reason) {
      console.log("Stream cancelled:", reason);
      aborted = true;
    },
  });

  // Handle client disconnect
  request.signal.addEventListener("abort", () => {
    console.log("Client disconnected, aborting stream.");
    aborted = true;
    // Controller might not be assigned yet if start() didn't run fully
    if (streamController) {
      // We don't close here immediately, let the loop finish or cancel naturally
      // This prevents errors if the controller is already closing/closed.
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
