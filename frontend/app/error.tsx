'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-6xl mb-6">🐾</div>
      <h2 className="text-3xl font-extrabold text-teal-900 mb-4">Something went wrong!</h2>
      <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
        We hit a snag trying to load this page. Don't worry, our rescue team has been notified!
      </p>
      <Button onClick={() => reset()} size="lg" className="px-8">
        Try again
      </Button>
    </div>
  );
}
