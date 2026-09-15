"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // TODO: Send to error tracking service (Sentry, etc.)
    // Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-linen flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-white border border-red-200 rounded-2xl p-8 text-center shadow-xl">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h2 className="font-display text-2xl text-ink mb-2">
                Something went wrong
              </h2>
              <p className="text-graphite/70 text-sm font-body mb-6">
                We encountered an unexpected error. Please try refreshing the page.
              </p>

              {/* Error details (dev only) */}
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <summary className="text-xs font-body font-bold text-red-800 cursor-pointer mb-2">
                    Error Details (dev only)
                  </summary>
                  <pre className="text-xs text-red-700 overflow-auto font-mono">
                    {this.state.error.message}
                    {"\n\n"}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    this.setState({ hasError: false });
                    window.location.reload();
                  }}
                  className="flex-1 py-3 bg-ink text-white text-sm font-body font-bold rounded-full hover:bg-brass hover:text-ink transition-colors"
                >
                  Refresh Page
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 border border-ink/20 text-ink text-sm font-body font-bold rounded-full hover:bg-cream transition-colors text-center"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
