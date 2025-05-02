"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChatEntry } from "@/db/schema";
import { useEffect, useState, useRef } from "react";

interface ChatProps {
  projectId: string;
  onPreviousClick: () => void;
  onNextClick: () => void;
  generatingReport: boolean;
}

export function Chat({
  projectId,
  onPreviousClick,
  onNextClick,
  generatingReport,
}: ChatProps) {
  const [chatEntries, setChatEntries] = useState<ChatEntry[]>([]);
  const [isChatComplete, setIsChatComplete] = useState(false);
  const lastEventIdRef = useRef<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (eventSourceRef.current) {
      console.log(
        "Effect run: Closing existing EventSource before initializing."
      );
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setChatEntries([]);
    setIsChatComplete(false);
    lastEventIdRef.current = null;

    let isMounted = true;

    const initializeChat = async () => {
      if (!isMounted) return;

      try {
        const initialResponse = await fetch(
          `/api/projects/chat?id=${projectId}`
        );

        if (!initialResponse.ok) {
          console.error(
            "Failed to fetch initial chat state:",
            initialResponse.statusText
          );
          setIsChatComplete(true);
          return;
        }

        const contentType = initialResponse.headers.get("content-type");

        if (!isMounted) return;

        if (contentType && contentType.includes("application/json")) {
          const completedChatHistory = await initialResponse.json();
          if (isMounted) {
            setChatEntries(completedChatHistory);
            setIsChatComplete(true);
            console.log("Chat already complete. Loaded history.");
          }
        } else if (contentType && contentType.includes("text/event-stream")) {
          console.log("Chat ongoing. Setting up EventSource...");

          if (eventSourceRef.current) {
            console.warn(
              "initializeChat: Found unexpected existing EventSource. Closing it."
            );
            eventSourceRef.current.close();
          }

          eventSourceRef.current = new EventSource(
            `/api/projects/chat?id=${projectId}`
          );

          eventSourceRef.current.onmessage = (event) => {
            if (!isMounted) return;
            if (event.lastEventId) {
              lastEventIdRef.current = event.lastEventId;
            } else {
            }

            try {
              const newEntry: ChatEntry = JSON.parse(event.data);
              if (isMounted) {
                setChatEntries((prevEntries) => {
                  if (prevEntries.some((entry) => entry.id === newEntry.id)) {
                    return prevEntries;
                  }
                  return [...prevEntries, newEntry];
                });
              }
            } catch (error) {
              console.error(
                "Failed to parse SSE data:",
                error,
                "Data:",
                event.data
              );
            }
          };

          eventSourceRef.current.onerror = (error) => {
            if (!isMounted) return;
            console.error("EventSource failed:", error);
            setIsChatComplete(true);
            eventSourceRef.current?.close();
            eventSourceRef.current = null;
          };
        } else {
          console.error("Unexpected content type received:", contentType);
          if (isMounted) {
            setIsChatComplete(true);
          }
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) {
          setIsChatComplete(true);
        }
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        console.log("Cleanup: Closing EventSource.");
        eventSourceRef.current.close();
        eventSourceRef.current = null;
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
          <Button onClick={onNextClick} disabled={generatingReport}>
            Next: View Report
          </Button>
        )}
      </div>
    </div>
  );
}
