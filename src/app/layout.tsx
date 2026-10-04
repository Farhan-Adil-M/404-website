import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./chapters.css";

export const metadata: Metadata = {
  title: "404 — PAGE NOT FOUND",
  description:
    "The page you were looking for does not exist. The team behind it does.",
};

export const viewport: Viewport = {
  themeColor: "#eae4d8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="locked">
      <head>
        {/* Archivo Black — the one display voice. System fallbacks for mono/serif. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <noscript>
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "var(--paper)",
              color: "var(--ink)",
              display: "grid",
              placeContent: "center",
              textAlign: "center",
              fontFamily: "Georgia, serif",
              padding: "0 8vw",
            }}
          >
            <p
              style={{
                fontFamily: "\"Archivo Black\", \"Arial Black\", sans-serif",
                fontSize: "28vw",
                lineHeight: 0.8,
              }}
            >
              404
            </p>
            <p style={{ marginTop: "4vh", fontSize: "18px" }}>
              The page you were looking for does not exist. The team behind it
              does.
            </p>
            <p
              style={{
                marginTop: "4vh",
                fontFamily: "ui-monospace, monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              ERR_NOT_FOUND — THIS ARCHIVE REQUIRES JAVASCRIPT
            </p>
          </div>
        </noscript>
      </body>
    </html>
  );
}
