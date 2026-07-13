"use client";

import { memo } from "react";
import { Shield, User, Bot, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VolunteerAssistantResponse } from "@/src/types";
import { useChat, ChatMessage } from "@/src/hooks/use-chat";

const MessageBubble = memo(({ message }: { message: ChatMessage<VolunteerAssistantResponse> }) => (
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
        <p>{message.content}</p>
        {message.data && (
          <div className="mt-4 space-y-3" role="region" aria-label="Additional information">
            {message.data.steps?.length ? (
              <div className="space-y-2">
                <p className="font-semibold">Steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  {message.data.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-green-600" aria-hidden="true" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
            {message.data.emergencyContact && (
              <div className="flex items-center gap-2 text-sm border-t pt-3 mt-3">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Emergency: {message.data.emergencyContact}</span>
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
  "Where should I guide wheelchair users?",
  "What's the emergency evacuation procedure?",
  "A child is lost, what do I do?",
];

export function VolunteerAssistant() {
  const {
    messages,
    input,
    setInput,
    isLoading,
    handleSend,
    handleKeyDown,
    scrollRef,
  } = useChat<VolunteerAssistantResponse>({
    apiEndpoint: "/api/volunteer",
    initialMessage:
      "Hello Volunteer! How can I help you assist fans today?",
    extractResponse: (data: Record<string, unknown>) => ({
      content: (data.guidance as string) || "",
      raw: data,
    }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Volunteer Assistant AI</h1>
          <p className="text-muted-foreground">
            Your guide for assisting fans and handling stadium situations.
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
              <Shield className="h-5 w-5" aria-hidden="true" />
              Volunteer Chat
            </CardTitle>
          </CardHeader>
          <ScrollArea ref={scrollRef} className="flex-1 p-4">
            <div className="space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
              {(messages as ChatMessage<VolunteerAssistantResponse>[]).map((message, index) => (
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
                placeholder="Ask about procedures, accessibility, or fan support..."
                onKeyDown={handleKeyDown}
                aria-label="Ask a question"
              />
              <Button onClick={handleSend} disabled={isLoading} aria-label="Send message">
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
