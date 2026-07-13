'use client';

import { useEffect, useState } from 'react';

let globalAnnouncerRef: ((message: string, priority?: 'polite' | 'assertive') => void) | null = null;

export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  globalAnnouncerRef?.(message, priority);
}

export function ScreenReaderAnnouncer(): React.ReactNode {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  useEffect(() => {
    globalAnnouncerRef = (message, priority) => {
      if (priority === 'assertive') {
        setAssertiveMessage((prev) => (prev ? '' : message));
      } else {
        setPoliteMessage((prev) => (prev ? '' : message));
      }
    };
    return () => {
      globalAnnouncerRef = null;
    };
  }, []);

  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {politeMessage}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertiveMessage}
      </div>
    </>
  );
}
