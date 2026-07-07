"use client";

import { useState } from "react";
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

export function FanAssistant() {
  const [messages, setMessages] = useState<
    {
      role: "user" | "assistant";
      content: string;
      data?: FanAssistantResponse;
    }[]
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm your StadiumOS AI Fan Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/fan-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });

      const data: FanAssistantResponse = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.rawResponse, data },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleQueries = [
    "I am at Gate C and my match starts in 15 minutes. My seat is Block 124.",
    "Where is the nearest restroom?",
    "Where can I get food?",
    "I need medical assistance.",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fan Assistant AI</h1>
          <p className="text-muted-foreground">
            Your smart companion for the FIFA World Cup 2026 experience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {exampleQueries.map((query, index) => (
            <Button
              key={index}
              variant="secondary"
              className="h-auto py-4 justify-start text-left whitespace-normal"
              onClick={() => setInput(query)}
            >
              {query}
            </Button>
          ))}
        </div>

        <Card className="h-150 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Chat
            </CardTitle>
          </CardHeader>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted">
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
                        <div className="mt-4 space-y-3">
                          {message.data.estimatedWalkingTime && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4" />
                              <span>
                                Estimated time:{" "}
                                {message.data.estimatedWalkingTime} min
                              </span>
                            </div>
                          )}
                          {message.data.crowdWarnings &&
                            message.data.crowdWarnings.length > 0 && (
                              <div className="flex items-start gap-2 text-sm text-destructive">
                                <AlertTriangle className="h-4 w-4 mt-0.5" />
                                <div>
                                  {message.data.crowdWarnings.map(
                                    (warning, i) => (
                                      <div key={i}>{warning}</div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          {message.data.accessibilityNotes && (
                            <div className="flex items-start gap-2 text-sm">
                              <Accessibility className="h-4 w-4 mt-0.5" />
                              <span>{message.data.accessibilityNotes}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg p-4 bg-muted">
                    <div className="flex gap-1">
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about navigation, facilities, or accessibility..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
