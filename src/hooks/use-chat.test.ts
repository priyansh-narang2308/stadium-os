import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from './use-chat';

describe('useChat', () => {
  it('should initialize with default message', () => {
    const { result } = renderHook(() =>
      useChat({
        apiEndpoint: '/api/test',
        initialMessage: 'Hello!',
      }),
    );

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Hello!');
    expect(result.current.messages[0].role).toBe('assistant');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update input state', () => {
    const { result } = renderHook(() =>
      useChat({
        apiEndpoint: '/api/test',
        initialMessage: 'Hello!',
      }),
    );

    act(() => {
      result.current.setInput('test query');
    });

    expect(result.current.input).toBe('test query');
  });

  it('should add user message on send', async () => {
    const { result } = renderHook(() =>
      useChat({
        apiEndpoint: '/api/test',
        initialMessage: 'Hello!',
      }),
    );

    act(() => {
      result.current.setInput('test query');
    });

    await act(async () => {
      try {
        await result.current.handleSend();
      } catch {
        // Expected - no server running
      }
    });

    expect(result.current.messages.length).toBe(3);
    expect(result.current.messages[1].role).toBe('user');
    expect(result.current.messages[1].content).toBe('test query');
    expect(result.current.messages[2].role).toBe('assistant');
    expect(result.current.messages[2].content).toContain('error');
  });

  it('should not send empty messages', async () => {
    const { result } = renderHook(() =>
      useChat({
        apiEndpoint: '/api/test',
        initialMessage: 'Hello!',
      }),
    );

    const initialCount = result.current.messages.length;

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.messages.length).toBe(initialCount);
  });

  it('should handle keydown Enter', () => {
    const { result } = renderHook(() =>
      useChat({
        apiEndpoint: '/api/test',
        initialMessage: 'Hello!',
      }),
    );

    const preventDefault = vi.fn();
    const event = { key: 'Enter', shiftKey: false, preventDefault } as unknown as React.KeyboardEvent;

    act(() => {
      result.current.setInput('test');
    });

    act(() => {
      result.current.handleKeyDown(event);
    });

    expect(preventDefault).toHaveBeenCalled();
  });
});
