import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MineBTC AI Content Engine WebUI",
  description: "Local generation console for MineBTC HashBeasts scripts, frames, videos, and dialogue QA.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061016",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav
          style={{
            position: "fixed",
            bottom: 14,
            right: 14,
            zIndex: 50,
            display: "flex",
            gap: 6,
            padding: 6,
            borderRadius: 999,
            background: "rgba(12,23,34,0.92)",
            border: "1px solid #1d2c3a",
            fontSize: 12,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          <a href="/" style={{ color: "#9fb6c9", textDecoration: "none", padding: "4px 10px" }}>
            Runs
          </a>
          <a href="/chapters" style={{ color: "#6fb0ff", textDecoration: "none", padding: "4px 10px" }}>
            Chapters
          </a>
        </nav>
        {children}
      </body>
    </html>
  );
}
