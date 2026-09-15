"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink via-graphite to-ink flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="bg-linen border border-ink/10 rounded-2xl p-8 shadow-2xl">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-display text-3xl text-ink mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-graphite/70 font-body">
              We apologize for the inconvenience. An unexpected error occurred.
            </p>
          </div>

          {/* Error message (dev only) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-body font-bold text-red-800 mb-2">
                Development Error Details:
              </p>
              <p className="text-xs text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => reset()}
              className="flex-1 py-3.5 bg-ink text-white text-sm font-body font-bold uppercase tracking-wider rounded-full hover:bg-brass hover:text-ink transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="flex-1 py-3.5 border-2 border-ink/20 text-ink text-sm font-body font-bold uppercase tracking-wider rounded-full hover:border-brass hover:text-brass transition-colors text-center"
            >
              Go Home
            </Link>
          </div>

          {/* Support link */}
          <p className="text-center text-xs text-graphite/60 font-body mt-6">
            If this problem persists,{" "}
            <Link href="/contact" className="text-brass hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
