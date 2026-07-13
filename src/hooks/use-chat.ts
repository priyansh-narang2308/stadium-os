import { useState, useCallback, useRef, useEffect } from 'react';

export interface ChatMessage<TData = unknown> {
  role: 'user' | 'assistant';
  content: string;
  data?: TData;
}

export interface UseChatOptions {
  apiEndpoint: string;
  initialMessage: string;
  extractResponse?: (data: Record<string, unknown>) => { content: string; raw: Record<string, unknown> };
}

export function useChat<TData = unknown>(options: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage<TData>[]>([
    { role: 'assistant', content: options.initialMessage },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: 'user' as const, content: input }]);
    setInput('');
    setIsLoading(true);
    setError(null);

    abortRef.current = new AbortController();

    try {
      const response = await fetch(options.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const rawData: Record<string, unknown> = await response.json();

      const extracted = options.extractResponse
        ? options.extractResponse(rawData)
        : { content: JSON.stringify(rawData), raw: rawData };

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          content: extracted.content,
          data: extracted.raw as TData,
        },
      ]);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return;
      setError('Failed to get response. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant' as const,
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
      abortRef.current = null;
    }
  }, [input, isLoading, options]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const retry = useCallback(() => {
    if (messages.length > 1) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUserMsg) {
        setInput(lastUserMsg.content);
        setMessages((prev) => prev.slice(0, -1));
      }
    }
  }, [messages]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setIsLoading(false);
  }, []);

  return {
    messages,
    input,
    setInput,
    isLoading,
    error,
    handleSend,
    handleKeyDown,
    retry,
    cancel,
    scrollRef,
  };
}
