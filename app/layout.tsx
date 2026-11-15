import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PermGate | Zero-Trust Context Firewall for Enterprise LLMs",
  description:
    "Identity-aware context middleware preventing enterprise data leakage via strict clearance-level document filtering for OpenAI, Anthropic, and RAG.",
  keywords: [
    "AI Firewall",
    "LLM Security",
    "RAG Permissions",
    "Zero Trust AI",
    "Okta LLM Middleware",
    "PermGate",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
