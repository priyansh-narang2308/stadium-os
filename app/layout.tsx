import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/src/components/layout/skip-link";
import { ScreenReaderAnnouncer } from "@/src/components/ui/announcement";
import { validateEnv } from "@/src/lib/security/middleware";

if (typeof globalThis !== 'undefined') {
  validateEnv().catch(() => {
    // Startup validation failure - app will fail gracefully at runtime
  });
}

const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | StadiumOS AI",
    default: "StadiumOS AI - FIFA World Cup 2026",
  },
  description:
    "AI-powered stadium intelligence platform for FIFA World Cup 2026",
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SkipLink />
        <ScreenReaderAnnouncer />
        <main id="main-content" className="flex-1 outline-none" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
