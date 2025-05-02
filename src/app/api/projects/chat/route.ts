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

  // Check if chat is already full (no stream needed)
  if (chatHistory.length >= MAX_MESSAGES) {
    // If chat is complete, return the full history as JSON
    // Note: No Last-Event-ID handling needed here, as it's not a stream.
    return NextResponse.json(chatHistory, { status: 200 });
  }

  // --- Start SSE Stream Handling ---

  // Read Last-Event-ID header sent by the client on reconnect
  const lastEventId = request.headers.get("Last-Event-ID");
  let historyToSend = chatHistory; // Default to sending all history

  if (lastEventId) {
    const lastReceivedIndex = chatHistory.findIndex(
      (entry) => entry.id === lastEventId
    );
    if (lastReceivedIndex !== -1) {
      // If found, only prepare to send messages *after* the last received one
      historyToSend = chatHistory.slice(lastReceivedIndex + 1);
      console.log(
        `Resuming stream after event ID: ${lastEventId}. Sending ${historyToSend.length} initial entries.`
      );
    } else {
      // If the ID is not in our history (edge case), send everything
      console.warn(
        `Last-Event-ID ${lastEventId} not found in history. Sending full history.`
      );
    }
  } else {
    // No header, it's a new connection or client doesn't support it
    console.log(
      `No Last-Event-ID. Sending initial ${historyToSend.length} chat entries...`
    );
  }

  // Create a transform stream for SSE
  let streamController: ReadableStreamDefaultController<Uint8Array>;
  let aborted = false;

  const stream = new ReadableStream({
    async start(controller) {
      streamController = controller;
      const encoder = new TextEncoder();

      // Function to send a chat message via SSE, including the message ID
      const sendChatMessage = (entry: ChatEntry) => {
        if (aborted) return;
        // Format as SSE: include 'id:' field for resume capability
        const message = `id: ${entry.id}
data: ${JSON.stringify(entry)}

`;
        try {
          controller.enqueue(encoder.encode(message));
        } catch (error) {
          // Handle potential errors if the controller is closed unexpectedly
          console.error("Error enqueuing message:", error);
          aborted = true; // Stop further processing
        }
      };

      // Send initial chat history (only the part client hasn't seen)
      console.log(`Sending initial ${historyToSend.length} chat entries...`);
      for (const entry of historyToSend) {
        // Use the potentially sliced historyToSend
        sendChatMessage(entry);
      }

      // Function to generate, send, and persist messages
      const generateAndSend = async () => {
        try {
          // Generation logic always starts based on the *full* chatHistory length,
          // regardless of what was initially sent from historyToSend.
          let currentMessageCount = chatHistory.length; // Base count on the full history

          // Check if we've already reached the limit *before* generating
          if (currentMessageCount >= MAX_MESSAGES) {
            console.log(
              "Message limit already reached after sending initial history."
            );
            return; // Exit generation if limit met
          }

          while (currentMessageCount < MAX_MESSAGES && !aborted) {
            // Determine the next persona
            const personaIndex = (currentMessageCount - 1) % personas.length; // -1 because moderator is 0, first persona is 1
            const currentPersona = personas[personaIndex];

            // Calculate messages left
            const messagesLeft = MAX_MESSAGES - currentMessageCount;

            // Generate the next chat entry using the full history for context
            const newEntry = await generateChatEntry(
              currentPersona,
              chatHistory, // Provide the complete history for context
              messagesLeft
            );

            // Add to local *full* history array
            chatHistory.push(newEntry);
            currentMessageCount++;

            // Send the *new* message to client
            sendChatMessage(newEntry);

            // Persist the updated *full* chat history asynchronously
            updateProjectChat(projectId, [...chatHistory]).catch((err) => {
              console.error("Failed to update chat history:", err);
              // Optional: handle persistence error
            });
          }
        } catch (error) {
          console.error("Error during chat generation:", error);
          if (!aborted) {
            try {
              controller.error(error); // Signal error to the client
            } catch (e) {
              console.error("Error signaling stream error:", e);
            }
          }
        } finally {
          if (!aborted) {
            console.log("Reached message limit or finished generation.");
            try {
              controller.close(); // Close the stream gracefully
            } catch (e) {
              console.error("Error closing stream:", e);
            }
          }
        }
      };

      // Start generation *after* initial history is sent
      generateAndSend();
    },
    cancel(reason) {
      console.log("Stream cancelled:", reason);
      aborted = true;
    },
  });

  // Handle client disconnect via request signal
  request.signal.addEventListener("abort", () => {
    console.log("Client disconnected, aborting stream.");
    aborted = true;
    // No need to explicitly close controller here, the loops/logic will stop.
  });

  // Return the stream response
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Optional: Add CORS headers if needed
    },
  });
}
