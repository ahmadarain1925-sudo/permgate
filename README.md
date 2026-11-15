# PermGate | Zero-Trust Context Firewall for Enterprise LLMs

> The identity-aware middleware sitting between enterprise employees and LLMs to eliminate confidential data leaks across RAG and context retrieval.

[![Security Clearance Audit](https://github.com/your-org/permgate/actions/workflows/security-tests.yml/badge.svg)](https://github.com/your-org/permgate/actions)
[![Next.js 14 App Router](https://img.shields.io/badge/Next.js-14_App_Router-black)](https://nextjs.org/)
[![TypeScript Strict](https://img.shields.io/badge/TypeScript-Strict_Mode-blue)](https://www.typescriptlang.org/)
[![OpenAI Compatible](https://img.shields.io/badge/OpenAI_API-Drop--in_Proxy-emerald)](https://platform.openai.com/docs/api-reference)

---

## 🔒 Architectural Overview

In enterprise RAG (Retrieval-Augmented Generation), LLMs retrieve internal documents via semantic search with zero awareness of who is asking. When an intern queries the company assistant about executive compensation or restructuring, standard vector stores return those records—causing catastrophic data leakage.

**PermGate** intercepts the prompt, determines the employee's verified clearance level (Levels 1 to 5) via Okta / Azure AD, and strictly partitions the context corpus **before prompt ingestion**:

```
[Employee Request + Okta Session] 
                 │
                 ▼
       [PermGate Proxy Gateway]
                 │
  ┌──────────────┴──────────────┐
  ▼                             ▼
[Authorized Documents]    [Blocked Documents] ──► [SIEM Log: Splunk/Datadog]
(Clearance <= User Level) (Clearance > User Level)
  │
  ▼
[Sanitized System Prompt] (Zero unauthorized tokens)
  │
  ▼
[Downstream LLM Inference: OpenAI / Anthropic]
  │
  ▼
[Sanitized Enterprise Response + Live Inspector]
```

---

## ⚡ 1-Line Drop-In OpenAI SDK Integration

PermGate acts as a drop-in replacement for `https://api.openai.com/v1`. Developers don't need to rewrite their code:

```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://localhost:3000/api/v1", // or https://api.permgate.com/v1
  defaultHeaders: {
    "X-Employee-ID": session.user.id, // e.g. "usr_intern_001" or Okta UID
  },
});

const completion = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{ role: "user", content: "What are the CEO's Q4 layoff plans?" }],
});

console.log(completion.choices[0].message.content);
console.log(completion.permgate_telemetry);
```

---

## 👥 Persona & Clearance Matrix

| Persona | Role | Clearance | Accessible Knowledge |
| :--- | :--- | :---: | :--- |
| **Alex Miller** | Contract Intern | **1** | Cafeteria Menu, Remote Work Policy (2 docs) |
| **Sarah Chen** | Junior Developer | **2** | Above + Git Workflow, Tier-2 Escalations (4 docs) |
| **Marcus Vance** | Lead AppSec Architect | **3** | Above + VPC Topology, Red Team Pen Test (6 docs) |
| **Dr. Elena Rostova** | VP of Research | **4** | Above + Project Apollo AI, M&A Shortlist (8 docs) |
| **David Sterling** | CEO & Board Director | **5** | All 10 docs including Q4 Layoff Matrix & Board Vault |

---

## 🚀 Running Locally

### 1. Install & Run Tests
```powershell
cd "C:\Users\COMPUTER\.gemini\antigravity\scratch\ai-permission-firewall"
npm run test
```

### 2. Launch Local Dev Server
```powershell
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser:
* Click **Interactive Sandbox** to test employee persona switching with the live firewall inspector.
* Click **Platform & Pricing** to view the enterprise marketing overview, pricing tiers, and CISO demo booking.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/chat/completions` | Drop-in OpenAI-compatible chat gateway with zero-trust context isolation. |
| `GET` | `/api/v1/audit/logs` | Real-time SIEM export for Splunk, Datadog, and AWS CloudWatch. |
| `POST` | `/api/middleware-chat` | Internal console route powering the interactive sandbox. |

---

## 💼 Commercial & Enterprise Assets

* 📊 **Investor Pitch Deck**: See [`docs/PITCH_DECK.md`](file:///C:/Users/COMPUTER/.gemini/antigravity/scratch/ai-permission-firewall/docs/PITCH_DECK.md)
* 🤝 **CISO Cold Outreach Playbook**: See [`docs/OUTREACH_KIT.md`](file:///C:/Users/COMPUTER/.gemini/antigravity/scratch/ai-permission-firewall/docs/OUTREACH_KIT.md)
* 🚢 **Vercel / Cloud Ready**: Self-contained Next.js 14 App Router project.
