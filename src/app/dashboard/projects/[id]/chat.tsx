"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatEntry } from "@/db/schema";
import { useEffect, useState } from "react";

interface ChatProps {
  projectId: string;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

export function Chat({ projectId, onPreviousClick, onNextClick }: ChatProps) {
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([]);
  const [isChatComplete, setIsChatComplete] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const initializeChat = async () => {
      try {
        const response = await fetch(`/api/projects/chat?id=${projectId}`);

        if (!response.ok) {
          console.error(
            "Failed to fetch initial chat state:",
            response.statusText
          );
          return;
        }

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const completedChatHistory = await response.json();
          setChatEntries(completedChatHistory);
          setIsChatComplete(true);
          console.log("Chat already complete. Loaded history.");
        } else if (contentType && contentType.includes("text/event-stream")) {
          console.log("Chat ongoing. Setting up EventSource...");
          eventSource = new EventSource(`/api/projects/chat?id=${projectId}`);

          eventSource.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              setChatEntries((prevEntries) => [...prevEntries, data]);
            } catch (error) {
              console.error(
                "Failed to parse SSE data:",
                error,
                "Data:",
                event.data
              );
            }
          };

          eventSource.onerror = (error) => {
            console.error("EventSource failed:", error);
            setIsChatComplete(true);
            eventSource?.close();
          };
        } else {
          console.error("Unexpected content type received:", contentType);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    };

    initializeChat();

    return () => {
      if (eventSource) {
        console.log("Closing EventSource.");
        eventSource.close();
      }
    };
  }, [projectId]);

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex-grow space-y-4 mb-4 overflow-y-auto">
        {chatEntries.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 pr-2">
            <Avatar className="mt-1 flex-shrink-0">
              <AvatarImage
                src={entry.avatar || "/moderator.png"}
                alt={entry.name}
              />
            </Avatar>
            <div className="flex flex-col bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm max-w-[85%]">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {entry.name}
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100 mt-1 whitespace-pre-wrap">
                {entry.message}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 self-end">
                {new Date(entry.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        {!isChatComplete && chatEntries.length === 0 && (
          <div className="text-center text-gray-500">Loading chat...</div>
        )}
        {isChatComplete && chatEntries.length > 0 && (
          <div className="text-center text-gray-500 pt-4">
            Chat session complete.
          </div>
        )}
      </div>

      <div className="flex justify-between mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="outline" onClick={onPreviousClick}>
          Previous
        </Button>
        {isChatComplete && (
          <Button onClick={onNextClick}>Next: View Report</Button>
        )}
      </div>
    </div>
  );
}
