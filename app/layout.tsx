import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://permgate.ai"),
  title: "PermGate.ai | Zero-Trust Context Firewall for Enterprise LLMs",
  description:
    "Identity-aware context middleware preventing enterprise data leakage via strict clearance-level document filtering for OpenAI, Anthropic, and RAG.",
  keywords: [
    "AI Firewall",
    "LLM Security",
    "RAG Permissions",
    "Zero Trust AI",
    "Okta LLM Middleware",
    "PermGate",
    "PermGate AI",
  ],
  openGraph: {
    title: "PermGate.ai | Zero-Trust Context Firewall for Enterprise LLMs",
    description: "Eliminate confidential RAG data leaks across departments before context ingestion.",
    url: "https://permgate.ai",
    siteName: "PermGate.ai",
    type: "website",
  },
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
