"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error (layout):", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(to bottom right, #1a1a1a, #2d2d2d)",
            padding: "1.5rem",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              background: "#f5f5f0",
              borderRadius: "1rem",
              padding: "2rem",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                width: "5rem",
                height: "5rem",
                background: "#fee2e2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <span style={{ fontSize: "2rem" }}>⚠️</span>
            </div>

            <h1
              style={{
                fontSize: "1.875rem",
                fontWeight: "bold",
                color: "#1a1a1a",
                marginBottom: "0.5rem",
              }}
            >
              Critical Error
            </h1>
            <p
              style={{
                color: "#666",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
              }}
            >
              A critical error occurred. Please refresh the page.
            </p>

            {process.env.NODE_ENV === "development" && error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "0.5rem",
                  padding: "1rem",
                  marginBottom: "1.5rem",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: "#991b1b",
                    marginBottom: "0.5rem",
                  }}
                >
                  Error: {error.message}
                </p>
                {error.digest && (
                  <p style={{ fontSize: "0.75rem", color: "#dc2626" }}>
                    ID: {error.digest}
                  </p>
                )}
              </div>
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <button
                onClick={() => reset()}
                style={{
                  padding: "0.875rem",
                  background: "#1a1a1a",
                  color: "white",
                  border: "none",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#c4a96b";
                  e.currentTarget.style.color = "#1a1a1a";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#1a1a1a";
                  e.currentTarget.style.color = "white";
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: "0.875rem",
                  border: "2px solid rgba(26,26,26,0.2)",
                  color: "#1a1a1a",
                  borderRadius: "9999px",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  display: "block",
                }}
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
