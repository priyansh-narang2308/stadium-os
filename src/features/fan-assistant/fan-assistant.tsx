"use client";

import { memo } from "react";
import {
  Send,
  User,
  Bot,
  Clock,
  AlertTriangle,
  Accessibility,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FanAssistantResponse } from "@/src/types";
import { useChat, ChatMessage } from "@/src/hooks/use-chat";

const MessageBubble = memo(({ message }: { message: ChatMessage<FanAssistantResponse> }) => (
  <div
    className={`flex gap-3 ${
      message.role === "user" ? "justify-end" : "justify-start"
    }`}
    role="article"
    aria-label={`${message.role} message`}
  >
    <div
      className={`flex gap-3 max-w-[80%] ${
        message.role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted" aria-hidden="true">
        {message.role === "user" ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      <div
        className={`rounded-lg p-4 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="whitespace-pre-line">{message.content}</p>
        {message.data && (
          <div className="mt-4 space-y-3" role="region" aria-label="Additional information">
            {message.data.estimatedWalkingTime && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" aria-hidden="true" />
                <span>Estimated time: {message.data.estimatedWalkingTime} min</span>
              </div>
            )}
            {message.data.crowdWarnings?.length ? (
              <div className="flex items-start gap-2 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 mt-0.5" aria-hidden="true" />
                <div>
                  {message.data.crowdWarnings.map((warning, i) => (
                    <div key={i}>{warning}</div>
                  ))}
                </div>
              </div>
            ) : null}
            {message.data.accessibilityNotes && (
              <div className="flex items-start gap-2 text-sm">
                <Accessibility className="h-4 w-4 mt-0.5" aria-hidden="true" />
                <span>{message.data.accessibilityNotes}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
));

MessageBubble.displayName = "MessageBubble";

const LoadingIndicator = memo(() => (
  <div className="flex gap-3" role="status" aria-live="polite" aria-label="Assistant is typing">
    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted" aria-hidden="true">
      <Bot className="h-4 w-4" />
    </div>
    <div className="rounded-lg p-4 bg-muted">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} aria-hidden="true" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} aria-hidden="true" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} aria-hidden="true" />
      </div>
    </div>
  </div>
));

LoadingIndicator.displayName = "LoadingIndicator";

const exampleQueries = [
  "I am at Gate C and my match starts in 15 minutes. My seat is Block 124.",
  "Where is the nearest restroom?",
  "Where can I get food?",
  "I need medical assistance.",
];

export function FanAssistant() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    handleSend,
    handleKeyDown,
    scrollRef,
  } = useChat<FanAssistantResponse>({
    apiEndpoint: "/api/fan-assistant",
    initialMessage:
      "Hello! I'm your StadiumOS AI Fan Assistant. How can I help you today?",
    extractResponse: (data: Record<string, unknown>) => ({
      content: (data.rawResponse as string) || "",
      raw: data,
    }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fan Assistant AI</h1>
          <p className="text-muted-foreground">
            Your smart companion for the FIFA World Cup 2026 experience.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-6 mb-8" aria-label="Example queries">
              {exampleQueries.map((query, index) => (
            <Button
              key={`ex-${index}`}
              variant="secondary"
              className="h-auto py-4 justify-start text-left whitespace-normal"
              onClick={() => setInput(query)}
              aria-label={`Use example query: ${query}`}
            >
              {query}
            </Button>
          ))}
        </section>

        <Card className="h-150 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" aria-hidden="true" />
              Chat
            </CardTitle>
          </CardHeader>
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
              {(messages as ChatMessage<FanAssistantResponse>[]).map((message, index) => (
                <MessageBubble key={`msg-${index}`} message={message} />
              ))}
              {isLoading && <LoadingIndicator />}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about navigation, facilities, or accessibility..."
                onKeyDown={handleKeyDown}
                aria-label="Ask a question"
              />
              <Button onClick={handleSend} disabled={isLoading} aria-label="Send message">
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
