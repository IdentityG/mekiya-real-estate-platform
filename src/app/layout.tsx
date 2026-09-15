import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://mekiya-real-estate.com"),
  title: {
    default: "Mekiya Real Estate — Premium Properties in Ethiopia",
    template: "%s | Mekiya Real Estate",
  },
  description:
    "Find your perfect property in Addis Ababa. Verified apartments, commercial spaces, and expert agents. From CMC to Bole — premium real estate made simple.",
  keywords: [
    "real estate Ethiopia",
    "Addis Ababa properties",
    "apartments for sale",
    "commercial real estate",
    "CMC properties",
    "Bole apartments",
    "property agents Ethiopia",
    "verified listings",
    "Ethiopian real estate",
  ],
  authors: [{ name: "Mekiya Real Estate" }],
  creator: "Mekiya Real Estate",
  publisher: "Mekiya Real Estate",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Mekiya Real Estate",
    title: "Mekiya Real Estate — Premium Properties in Ethiopia",
    description:
      "Find your perfect property in Addis Ababa. Verified apartments, commercial spaces, and expert agents.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mekiya Real Estate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mekiya Real Estate — Premium Properties in Ethiopia",
    description:
      "Find your perfect property in Addis Ababa. Verified apartments, commercial spaces, and expert agents.",
    images: ["/og-image.jpg"],
    creator: "@mekiya_realestate",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-linen">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-linen text-ink antialiased font-body">
        <SessionProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </SessionProvider>
      </body>
    </html>
  );
}
