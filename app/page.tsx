"use client";

import React, { useState } from "react";
import { MOCK_USERS, User, Document, ClearanceLevel } from "@/lib/db";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
  userClearance?: ClearanceLevel;
  stats?: {
    approvedCount: number;
    blockedCount: number;
    redactionPercentage: string;
  };
}

interface MiddlewareResponse {
  success: boolean;
  timestamp: string;
  requestId: string;
  user: User;
  stats: {
    totalEvaluated: number;
    approvedCount: number;
    blockedCount: number;
    redactionPercentage: string;
  };
  approvedDocuments: Document[];
  blockedDocuments: Document[];
  secureSystemPrompt: string;
  llmResponse: string;
}

const CLEARANCE_COLORS: Record<ClearanceLevel, { bg: string; text: string; border: string; label: string }> = {
  1: { bg: "bg-blue-950/80", text: "text-blue-400", border: "border-blue-700/60", label: "Level 1: Unclassified" },
  2: { bg: "bg-cyan-950/80", text: "text-cyan-400", border: "border-cyan-700/60", label: "Level 2: Confidential" },
  3: { bg: "bg-amber-950/80", text: "text-amber-400", border: "border-amber-700/60", label: "Level 3: Secret" },
  4: { bg: "bg-orange-950/80", text: "text-orange-400", border: "border-orange-700/60", label: "Level 4: Top Secret" },
  5: { bg: "bg-rose-950/80", text: "text-rose-400", border: "border-rose-700/60", label: "Level 5: Executive Compartment" },
};

const SAMPLE_PROMPTS = [
  { label: "CEO Q4 Layoffs [L5]", prompt: "What are the CEO's Q4 layoff plans and restructuring numbers?" },
  { label: "Project Apollo AI [L4]", prompt: "Explain Project Apollo's autonomous synthetic intelligence engine." },
  { label: "Production Network [L3]", prompt: "What is our production VPC network topology and mTLS setup?" },
  { label: "Git Onboarding [L2]", prompt: "What are the standard pull request rules and SonarQube requirements?" },
  { label: "Cafeteria Menu [L1]", prompt: "What is on the cafeteria menu for lunch this week?" },
];

export default function PermGateDashboard() {
  const [viewMode, setViewMode] = useState<"sandbox" | "enterprise">("sandbox");
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default: Level 1 Intern
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "assistant",
      content:
        "Welcome to PermGate. Authenticated as Alex Miller (Level 1 Intern). Any context outside your verified clearance is strictly stripped before reaching the LLM context window.",
      timestamp: "System Online",
    },
  ]);
  const [lastDebugData, setLastDebugData] = useState<MiddlewareResponse | null>(null);
  const [activeTab, setActiveTab] = useState<"approved" | "blocked" | "prompt">("approved");
  const [demoRequested, setDemoRequested] = useState(false);

  const handleSendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    if (!promptToSend.trim() || isLoading) return;

    const userMsgId = `user_${Date.now()}`;
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      {
        id: userMsgId,
        sender: "user",
        content: promptToSend,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        userClearance: currentUser.clearanceLevel,
      },
    ];

    setChatHistory(newHistory);
    setInputPrompt("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/middleware-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          userPrompt: promptToSend,
        }),
      });

      if (!res.ok) {
        throw new Error(`PermGate Firewall returned HTTP ${res.status}`);
      }

      const data: MiddlewareResponse = await res.json();
      setLastDebugData(data);

      setChatHistory([
        ...newHistory,
        {
          id: `asst_${Date.now()}`,
          sender: "assistant",
          content: data.llmResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          userClearance: currentUser.clearanceLevel,
          stats: {
            approvedCount: data.stats.approvedCount,
            blockedCount: data.stats.blockedCount,
            redactionPercentage: data.stats.redactionPercentage,
          },
        },
      ]);
    } catch (err: any) {
      setChatHistory([
        ...newHistory,
        {
          id: `err_${Date.now()}`,
          sender: "assistant",
          content: `⚠️ PermGate Security Exception: ${err.message || "Failed to communicate with context firewall."}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const userTheme = CLEARANCE_COLORS[currentUser.clearanceLevel];

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg shadow-[0_0_15px_rgba(16,185,129,0.25)]">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-white">PermGate</h1>
                <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full font-bold">
                  Zero-Trust Context Firewall
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Identity-Aware LLM Middleware for Security & DevOps</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="ml-4 flex bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setViewMode("sandbox")}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === "sandbox"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Interactive Sandbox
            </button>
            <button
              onClick={() => setViewMode("enterprise")}
              className={`px-3 py-1 rounded-md transition ${
                viewMode === "enterprise"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Platform & Pricing
            </button>
          </div>
        </div>

        {/* Right Header Identity Switcher (Visible in Sandbox) */}
        {viewMode === "sandbox" ? (
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider font-mono text-slate-400">Simulate Employee:</span>
            <div className="relative">
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const found = MOCK_USERS.find((u) => u.id === e.target.value);
                  if (found) setCurrentUser(found);
                }}
                className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer font-medium transition"
              >
                {MOCK_USERS.map((user) => (
                  <option key={user.id} value={user.id} className="bg-slate-900 text-slate-200">
                    {user.name} — {user.role} (Level {user.clearanceLevel})
                  </option>
                ))}
              </select>
            </div>

            <div className={`px-3 py-1 rounded-md text-xs font-mono font-semibold border ${userTheme.bg} ${userTheme.text} ${userTheme.border}`}>
              {userTheme.label}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("sandbox")}
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600"
            >
              Launch Console
            </button>
            <button
              onClick={() => setDemoRequested(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-md transition"
            >
              Book 15-Min CISO Demo
            </button>
          </div>
        )}
      </header>

      {/* VIEW 1: ENTERPRISE MARKETING & ARCHITECTURE OVERVIEW */}
      {viewMode === "enterprise" && (
        <div className="flex-1 overflow-y-auto p-8 space-y-12 max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 text-xs font-mono">
              <span>🔒 SOC 2 Type II Certified Architecture</span>
              <span>•</span>
              <span>Zero-Data Retention Guaranteed</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
              The Identity-Aware Context Firewall for Enterprise LLMs
            </h2>
            <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              PermGate intercepts enterprise AI queries, verifies user clearance via Okta and Azure AD, and eliminates confidential RAG data leaks at the token boundary before reaching the model.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setViewMode("sandbox")}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-lg text-sm shadow-lg shadow-emerald-950/50 transition flex items-center gap-2"
              >
                <span>⚡ Test Live Interactive Sandbox</span>
              </button>
              <button
                onClick={() => setDemoRequested(true)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3 rounded-lg text-sm transition"
              >
                Schedule Architecture Briefing
              </button>
            </div>
          </section>

          {/* One-Line Drop-in Replacement Code Block */}
          <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Drop-In OpenAI & Anthropic SDK Compatibility</h3>
                <p className="text-xs text-slate-400">Zero codebase rewrite. Just point your existing OpenAI client to PermGate.</p>
              </div>
              <span className="text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded">
                GET /api/v1/chat/completions
              </span>
            </div>
            <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`import OpenAI from "openai";

// Drop-in replacement: Simply point baseURL to PermGate and pass employee identity
const openai = new OpenAI({
  baseURL: "https://api.permgate.com/v1", // or http://localhost:3000/api/v1
  defaultHeaders: {
    "X-Employee-ID": session.user.id, // e.g. "usr_intern_001" or Okta UID
  },
});

const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{ role: "user", content: "What are the CEO's Q4 layoff plans?" }],
});

// PermGate guarantees zero unauthorized tokens reach OpenAI context.`}
            </pre>
          </section>

          {/* 3 Pillars for CISOs & DevOps */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-2xl">🛡️</div>
              <h4 className="font-bold text-white text-sm">Identity & Directory Sync</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Syncs with Okta, Microsoft Entra ID (Azure AD), and Google Workspace. When an employee is offboarded or reassigned, clearance boundaries update instantly.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-2xl">⚡</div>
              <h4 className="font-bold text-white text-sm">Zero-Leakage Guarantee</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike post-generation classifiers, PermGate strips unauthorized documents before prompt concatenation, making adversarial jailbreaks mathematically impossible.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="text-2xl">📊</div>
              <h4 className="font-bold text-white text-sm">Continuous SIEM Telemetry</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stream breach attempts, blocked documents, and employee audit trails straight into Splunk, Datadog, or AWS EventBridge in real time.
              </p>
            </div>
          </section>

          {/* Enterprise Pricing Matrix */}
          <section className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">Transparent Enterprise Pricing</h3>
              <p className="text-xs text-slate-400">Scale from early pilot to company-wide zero-trust enforcement.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Starter */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-base">Starter Pilot</h4>
                  <div className="text-3xl font-extrabold text-white">$499 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <p className="text-xs text-slate-400">For engineering teams piloting internal RAG with up to 50 employees.</p>
                  <ul className="text-xs space-y-2 text-slate-300 font-mono pt-2">
                    <li>✓ Up to 50 Active Employees</li>
                    <li>✓ Cloud-hosted PermGate Proxy</li>
                    <li>✓ Standard Google Workspace & Slack Sync</li>
                    <li>✓ 3 Clearance Levels</li>
                  </ul>
                </div>
                <button
                  onClick={() => setDemoRequested(true)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-xs transition"
                >
                  Start 30-Day Pilot
                </button>
              </div>

              {/* Growth */}
              <div className="p-6 rounded-xl bg-slate-900 border-2 border-emerald-500/80 relative flex flex-col justify-between space-y-4 shadow-xl shadow-emerald-950/20">
                <div className="absolute -top-3 right-4 bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                  Most Popular
                </div>
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-base">Growth Mid-Market</h4>
                  <div className="text-3xl font-extrabold text-white">$2,500 <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                  <p className="text-xs text-slate-400">For mid-market enterprises deploying cross-departmental AI agents.</p>
                  <ul className="text-xs space-y-2 text-slate-200 font-mono pt-2">
                    <li>✓ Up to 500 Employees</li>
                    <li>✓ Native Okta & Azure AD SCIM Sync</li>
                    <li>✓ 5 Clearance Tiers (Unclassified to Board)</li>
                    <li>✓ Real-Time Splunk / Datadog SIEM Stream</li>
                    <li>✓ Sub-20ms Gateway Latency SLA</li>
                  </ul>
                </div>
                <button
                  onClick={() => setDemoRequested(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-xs transition shadow-md"
                >
                  Book Growth Demo
                </button>
              </div>

              {/* Enterprise */}
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h4 className="font-bold text-white text-base">Enterprise Sovereign</h4>
                  <div className="text-3xl font-extrabold text-white">Custom <span className="text-xs text-slate-400 font-normal">Annual</span></div>
                  <p className="text-xs text-slate-400">For FinTech, Healthcare, and Defense with zero-egress VPC mandates.</p>
                  <ul className="text-xs space-y-2 text-slate-300 font-mono pt-2">
                    <li>✓ Unlimited Employees & LLM Gateways</li>
                    <li>✓ Self-Hosted VPC / On-Prem Kubernetes Helm</li>
                    <li>✓ Custom HSM & Shamir Key Vault Integration</li>
                    <li>✓ SOC 2 Type II & HIPAA BAA Compliance</li>
                    <li>✓ 24/7 Dedicated Security Architect</li>
                  </ul>
                </div>
                <button
                  onClick={() => setDemoRequested(true)}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2 rounded-lg text-xs transition"
                >
                  Contact CISO Solutions
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE FIREWALL SANDBOX & LIVE INSPECTOR */}
      {viewMode === "sandbox" && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Column: Chat Interface */}
          <div className="flex-1 flex flex-col border-r border-slate-800/80 bg-slate-950">
            {/* Quick Prompts Bar */}
            <div className="p-3 border-b border-slate-800/60 bg-slate-900/40 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
              <span className="text-slate-400 font-mono shrink-0 pl-1">Preset Tests:</span>
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputPrompt(sample.prompt);
                    handleSendMessage(sample.prompt);
                  }}
                  disabled={isLoading}
                  className="shrink-0 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md transition text-xs font-mono flex items-center gap-1.5 disabled:opacity-50"
                >
                  <span>⚡</span>
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-400">
                    <span>{msg.sender === "user" ? currentUser.name : "PermGate Security Enclave"}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.stats && (
                      <span className="text-emerald-400 font-mono">
                        [Firewall: {msg.stats.approvedCount} Passed, {msg.stats.blockedCount} Blocked]
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-2xl rounded-xl p-4 text-sm leading-relaxed shadow-lg ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-br-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none font-sans"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex flex-col items-start space-y-1">
                  <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-2">
                    <span className="animate-spin inline-block">⚙️</span>
                    <span>PermGate Enforcing Zero-Trust Clearance for {currentUser.name} (L{currentUser.clearanceLevel})...</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-xl p-4 text-xs font-mono animate-pulse">
                    Evaluating enterprise documents... Filtering context before prompt ingestion...
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input Box */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-3"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder={`Query AI as ${currentUser.name} (Clearance Level ${currentUser.clearanceLevel})...`}
                    disabled={isLoading}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !inputPrompt.trim()}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium px-5 py-3 rounded-lg text-sm transition flex items-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-md shadow-emerald-950/40"
                >
                  {isLoading ? "Enforcing..." : "Send Query"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: LIVE FIREWALL INSPECTOR & AUDIT STREAM */}
          <aside className="w-[480px] border-l border-slate-800 bg-slate-900/90 flex flex-col shrink-0">
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white">PermGate Inspector</span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-xs text-slate-400">Zero-Trust Context Verification for Active Request</p>
              </div>
              {lastDebugData && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {lastDebugData.requestId}
                </span>
              )}
            </div>

            {/* Metrics Overview Ribbon */}
            {lastDebugData ? (
              <div className="grid grid-cols-3 gap-2 p-3 border-b border-slate-800/80 bg-slate-950/50 text-center font-mono">
                <div className="bg-slate-900/80 border border-emerald-900/40 p-2 rounded-lg">
                  <div className="text-lg font-bold text-emerald-400">{lastDebugData.stats.approvedCount}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Approved</div>
                </div>
                <div className="bg-slate-900/80 border border-rose-900/40 p-2 rounded-lg">
                  <div className="text-lg font-bold text-rose-400">{lastDebugData.stats.blockedCount}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Blocked</div>
                </div>
                <div className="bg-slate-900/80 border border-cyan-900/40 p-2 rounded-lg">
                  <div className="text-lg font-bold text-cyan-400">{lastDebugData.stats.redactionPercentage}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">Filtered</div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-slate-800/80 text-center text-xs text-slate-500 font-mono">
                Execute a query to inspect live clearance partitioning
              </div>
            )}

            {/* Debug Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-900 text-xs font-mono shrink-0">
              <button
                onClick={() => setActiveTab("approved")}
                className={`flex-1 py-2.5 px-3 border-b-2 font-medium flex items-center justify-center gap-1.5 transition ${
                  activeTab === "approved"
                    ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>✅ Approved</span>
                {lastDebugData && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-900/60 text-emerald-300 text-[10px]">
                    {lastDebugData.approvedDocuments.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("blocked")}
                className={`flex-1 py-2.5 px-3 border-b-2 font-medium flex items-center justify-center gap-1.5 transition ${
                  activeTab === "blocked"
                    ? "border-rose-500 text-rose-400 bg-rose-950/20"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🚫 Blocked</span>
                {lastDebugData && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-900/60 text-rose-300 text-[10px]">
                    {lastDebugData.blockedDocuments.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("prompt")}
                className={`flex-1 py-2.5 px-3 border-b-2 font-medium flex items-center justify-center gap-1.5 transition ${
                  activeTab === "prompt"
                    ? "border-cyan-500 text-cyan-400 bg-cyan-950/20"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <span>🔍 Raw Prompt</span>
              </button>
            </div>

            {/* Tab Content Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {!lastDebugData ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <div className="text-3xl mb-2">🛡️</div>
                  <p className="text-sm font-medium text-slate-400">PermGate Firewall Armed</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Select a preset scenario above. PermGate will verify clearance against {currentUser.name}&apos;s Level {currentUser.clearanceLevel} authorization in real time.
                  </p>
                </div>
              ) : activeTab === "approved" ? (
                <div>
                  <div className="text-xs font-mono text-emerald-400/90 mb-3 flex items-center justify-between">
                    <span>Authorized Context (Clearance ≤ Level {lastDebugData.user.clearanceLevel})</span>
                    <span>{lastDebugData.approvedDocuments.length} passed</span>
                  </div>

                  {lastDebugData.approvedDocuments.length === 0 ? (
                    <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                      No documents qualified for this clearance level.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lastDebugData.approvedDocuments.map((doc) => {
                        const badge = CLEARANCE_COLORS[doc.requiredClearance];
                        return (
                          <div
                            key={doc.id}
                            className="p-3.5 rounded-lg bg-slate-950/70 border border-emerald-900/40 hover:border-emerald-700/60 transition space-y-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-semibold text-slate-200 leading-snug">{doc.title}</h4>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                              >
                                Level {doc.requiredClearance}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-3">
                              {doc.content}
                            </p>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-800/60">
                              <span>ID: {doc.id}</span>
                              <span className="text-emerald-400">PASSED PERMGATE</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : activeTab === "blocked" ? (
                <div>
                  <div className="text-xs font-mono text-rose-400/90 mb-3 flex items-center justify-between">
                    <span>Exceeds Clearance &gt; Level {lastDebugData.user.clearanceLevel} (STRIPPED)</span>
                    <span>{lastDebugData.blockedDocuments.length} blocked</span>
                  </div>

                  {lastDebugData.blockedDocuments.length === 0 ? (
                    <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 font-mono">
                      ✓ Level 5 Full Clearance. All corporate documents authorized. Zero redactions needed.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lastDebugData.blockedDocuments.map((doc) => {
                        const badge = CLEARANCE_COLORS[doc.requiredClearance];
                        return (
                          <div
                            key={doc.id}
                            className="p-3.5 rounded-lg bg-rose-950/10 border border-rose-900/50 hover:border-rose-700/60 transition space-y-2 relative overflow-hidden"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-semibold text-rose-200/90 flex items-center gap-1.5">
                                  <span>🔒</span>
                                  <span>{doc.title}</span>
                                </h4>
                                <div className="text-[10px] font-mono text-rose-400/70 mt-0.5">
                                  Leak Blocked: Requires L{doc.requiredClearance} vs User L{lastDebugData.user.clearanceLevel}
                                </div>
                              </div>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                              >
                                Level {doc.requiredClearance}
                              </span>
                            </div>

                            <div className="p-2 rounded bg-slate-950/80 border border-rose-950 text-[11px] font-mono text-slate-500 select-none">
                              <span className="text-rose-500 font-semibold">[STRIPPED BY PERMGATE]:</span>{" "}
                              {doc.content.slice(0, 48)}... [ZERO TOKEN LEAK]
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-mono text-rose-400/80 pt-1 border-t border-rose-950/80">
                              <span>Classification: {doc.classificationName}</span>
                              <span className="bg-rose-950 px-1.5 py-0.5 rounded text-rose-400 font-semibold">
                                ZERO CONTEXT LEAK
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-cyan-400">Sanitized Prompt Ingested by LLM</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(lastDebugData.secureSystemPrompt)}
                      className="text-[11px] text-slate-400 hover:text-white font-mono bg-slate-800 px-2 py-1 rounded"
                    >
                      Copy
                    </button>
                  </div>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-cyan-900">
                    {lastDebugData.secureSystemPrompt}
                  </pre>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Demo Booking Modal */}
      {demoRequested && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base">Schedule 15-Min CISO Demo</h3>
              <button
                onClick={() => setDemoRequested(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Discover how PermGate integrates with your Okta directory and deploys as a drop-in proxy inside your AWS or Azure VPC.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you! A PermGate enterprise security architect will reach out within 2 hours.");
                setDemoRequested(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Company / Team Size</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>1 - 50 employees</option>
                  <option>51 - 250 employees</option>
                  <option>251 - 1,000 employees</option>
                  <option>1,000+ employees (Enterprise)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">Identity Provider</label>
                <select className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Okta</option>
                  <option>Microsoft Entra ID (Azure AD)</option>
                  <option>Google Workspace</option>
                  <option>Ping Identity / Other</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-md"
              >
                Confirm Priority Demo
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
