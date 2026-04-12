'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full">
          <div className="text-6xl mb-6">🐾</div>
          <h2 className="text-3xl font-extrabold text-teal-900 mb-4">Critical Error</h2>
          <p className="text-lg text-gray-600 mb-8">
            The application encountered a critical error holding up the layout.
          </p>
          <button
            onClick={() => reset()}
            className="bg-teal-700 text-white font-semibold py-3 px-8 rounded-xl hover:bg-teal-800 transition-colors"
          >
            Reboot Application
          </button>
        </div>
      </body>
    </html>
  );
}
