// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "LabConnect UCSC",
  description: "Find research opportunities across UCSC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Shared Header */}
        <header
          style={{
            backgroundColor: "white",
            padding: "1rem",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1>
                <span style={{ fontWeight: "bold", color: "#1a365d" }}>
                  Lab
                </span>
                <span style={{ fontWeight: "bold", color: "#1a365d" }}>
                  Connect
                </span>{" "}
                <span style={{ color: "#4a5568" }}>UCSC</span>
              </h1>
            </div>
            <nav style={{ display: "flex", gap: "1rem" }}>
              <a
                href="/"
                style={{
                  color: "#4a5568",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Home
              </a>
              <a
                href="/directory"
                style={{
                  color: "#4a5568",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Directory
              </a>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>

        {/* Shared Footer */}
        <footer
          style={{
            backgroundColor: "#f7fafc",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginBottom: "0.5rem",
              }}
            >
              <a
                href="/about"
                style={{ color: "#4a5568", textDecoration: "none" }}
              >
                About Us
              </a>
              <a
                href="/contact"
                style={{ color: "#4a5568", textDecoration: "none" }}
              >
                Contact
              </a>
              <a
                href="/privacy"
                style={{ color: "#4a5568", textDecoration: "none" }}
              >
                Privacy Policy
              </a>
            </div>
            <p style={{ color: "#718096", fontSize: "0.875rem" }}>
              Contact us at: info@labconnect.ucsc.edu
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
