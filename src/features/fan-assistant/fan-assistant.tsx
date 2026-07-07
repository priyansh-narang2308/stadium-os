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

// Type definitions for the Fan Assistant response
export interface FanAssistantResponse {
  rawResponse: string;
  estimatedWalkingTime?: number;
  crowdWarnings?: string[];
  accessibilityNotes?: string;
  nearestFacilities?: Array<{
    name: string;
    distance: string;
    type: "restroom" | "food" | "medical" | "information";
  }>;
  navigationSteps?: string[];
}

// Type for message structure
interface Message {
  role: "user" | "assistant";
  content: string;
  data?: FanAssistantResponse;
}

export function FanAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your StadiumOS AI Fan Assistant. How can I help you today?",
      data: {
        rawResponse:
          "Hello! I'm your StadiumOS AI Fan Assistant. How can I help you today?",
        estimatedWalkingTime: 0,
        crowdWarnings: [],
        accessibilityNotes:
          "Accessibility assistance is available at all entrances.",
        nearestFacilities: [],
        navigationSteps: [],
      },
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/fan-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data: FanAssistantResponse = await response.json();

      // Ensure data has required structure
      const assistantMessage: Message = {
        role: "assistant",
        content:
          data.rawResponse ||
          "I've received your request. How else can I help?",
        data: {
          rawResponse:
            data.rawResponse ||
            "I've received your request. How else can I help?",
          estimatedWalkingTime: data.estimatedWalkingTime || 0,
          crowdWarnings: data.crowdWarnings || [],
          accessibilityNotes:
            data.accessibilityNotes || "Accessibility assistance is available.",
          nearestFacilities: data.nearestFacilities || [],
          navigationSteps: data.navigationSteps || [],
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content:
          "Sorry, I encountered an error. Please try again or visit the nearest information desk.",
        data: {
          rawResponse: "Error occurred",
          estimatedWalkingTime: 0,
          crowdWarnings: [],
          accessibilityNotes:
            "Please visit the nearest information desk for assistance.",
          nearestFacilities: [],
          navigationSteps: [],
        },
      };
      setMessages((prev) => [...prev, errorMessage]);
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

  // Helper function to render facility icons
  const getFacilityIcon = (type: string) => {
    switch (type) {
      case "restroom":
        return "🚻";
      case "food":
        return "🍔";
      case "medical":
        return "🏥";
      case "information":
        return "ℹ️";
      default:
        return "📍";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fan Assistant AI</h1>
          <p className="text-muted-foreground">
            Your smart companion for the FIFA World Cup 2026 experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {exampleQueries.map((query, index) => (
            <Button
              key={index}
              variant="secondary"
              className="h-auto py-4 px-4 justify-start text-left whitespace-normal text-sm"
              onClick={() => {
                setInput(query);
                // Optionally auto-submit after a short delay
                setTimeout(() => {
                  if (query.trim()) {
                    handleSend();
                  }
                }, 300);
              }}
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
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
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

                      {/* Display additional data if available */}
                      {message.data && message.role === "assistant" && (
                        <div className="mt-4 space-y-3 border-t pt-3">
                          {message.data.estimatedWalkingTime &&
                            message.data.estimatedWalkingTime > 0 && (
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4" />
                                <span>
                                  Estimated walking time:{" "}
                                  {message.data.estimatedWalkingTime} minutes
                                </span>
                              </div>
                            )}

                          {message.data.navigationSteps &&
                            message.data.navigationSteps.length > 0 && (
                              <div className="flex flex-col gap-1 text-sm">
                                <span className="font-medium">
                                  Navigation steps:
                                </span>
                                <ol className="list-decimal list-inside space-y-1">
                                  {message.data.navigationSteps.map(
                                    (step, i) => (
                                      <li key={i}>{step}</li>
                                    ),
                                  )}
                                </ol>
                              </div>
                            )}

                          {message.data.nearestFacilities &&
                            message.data.nearestFacilities.length > 0 && (
                              <div className="flex flex-col gap-1 text-sm">
                                <span className="font-medium">
                                  Nearest facilities:
                                </span>
                                {message.data.nearestFacilities.map(
                                  (facility, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-2"
                                    >
                                      <span>
                                        {getFacilityIcon(facility.type)}
                                      </span>
                                      <span>
                                        {facility.name} - {facility.distance}
                                      </span>
                                    </div>
                                  ),
                                )}
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
                <div className="flex gap-3 justify-start">
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
                className="flex-1"
                disabled={isLoading}
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
