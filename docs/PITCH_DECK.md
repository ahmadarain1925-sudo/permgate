# PermGate: Seed Pitch Deck
> **Zero-Trust Context Firewall for Enterprise LLMs**  
> *Preventing confidential data leaks in RAG and Enterprise AI before context ingestion.*

---

## Slide 1: The Problem
### Enterprise GenAI is Blocked by Security & Legal
* **The Surge**: 82% of Global 2000 enterprises are building internal AI assistants and RAG (Retrieval-Augmented Generation) systems.
* **The Blocker**: CISOs and Legal Counsel are halting production deployments.
* **Why?** Standard vector databases (Pinecone, pgvector, Qdrant) search strictly by semantic similarity. They have **zero awareness of employee clearance or IAM policies**.
* **The Disaster**: If an intern prompts the company AI: *"What are the upcoming compensation restructuring plans?"*, naive RAG returns CEO-only documents straight into the prompt context window.

---

## Slide 2: The Failure of Existing Solutions
* **Data Loss Prevention (DLP)**: Post-processing classifiers operate *after* the LLM has already digested confidential tokens, resulting in high latency (>800ms) and easy bypass via prompt injection.
* **Database Row-Level Security (RLS)**: Impossible to apply uniformly across unstructured data scattered in Slack, Google Drive, Notion, and Confluence.
* **Custom Code**: Every engineering team is forced to reinvent clearance parsing—resulting in leaky regexes and broken authorization boundaries.

---

## Slide 3: The Solution — PermGate
### The Identity-Aware Middleware Between Employees and LLMs
* **Drop-in Proxy**: Acts as a transparent proxy compatible with OpenAI, Anthropic, Bedrock, and open-source models.
* **Clearance-Bound Retrieval**: Synchronizes with corporate IdPs (Okta, Azure AD, Google Workspace) via SCIM.
* **Pre-Context Ingestion Filtering**: Strips unauthorized document chunks **before** prompt concatenation.
* **Adversarial Immunity**: Because sensitive tokens never enter the LLM's prompt window, prompt injections (DAN, jailbreaks) are mathematically incapable of leaking classified data.

---

## Slide 4: How It Works (The 3-Step Firewall Pipeline)
```
[Employee Request + Okta Token]
             │
             ▼
    [PermGate Engine]
             │
   ┌─────────┴─────────┐
   ▼                   ▼
[Approved Context]   [Blocked Context] ──► [SIEM Event: Splunk/Datadog]
   │
   ▼
[Sanitized Prompt] ──► [OpenAI / Anthropic] ──► [Secure Enterprise Answer]
```
1. **Identity Resolution**: PermGate extracts employee identity and clearance level (Levels 1–5 / Department tags).
2. **Context Arbitration**: Automatically partitions enterprise document corpus. Unauthorized records are stripped and logged as security anomalies.
3. **Zero-Leak Forwarding**: Constructs an authorized system prompt and streams responses back with sub-20ms latency overhead.

---

## Slide 5: Market Opportunity (TAM)
* **AI TRiSM (Trust, Risk & Security Management)**: Projected to reach **$7.4B by 2028** (Gartner).
* **Enterprise Search & RAG Security**: Expanding rapidly as 100,000+ companies adopt enterprise ChatGPT/Claude alternatives.
* **Initial Wedge**: Mid-market to enterprise companies (200–5,000 employees) in **Fintech, Healthcare, Legal, and Defense** where data clearance is legally mandated.

---

## Slide 6: Business Model & Unit Economics
* **Starter Pilot**: $499/month (Up to 50 employees, cloud-hosted).
* **Growth Mid-Market**: $2,500 – $5,000/month (Up to 500 employees, native Okta SCIM sync, Datadog SIEM integration).
* **Enterprise Sovereign**: $50,000 – $120,000/year (Self-hosted on-prem Kubernetes Helm chart, SOC 2 / HIPAA compliance, custom HSM).
* **Gross Margins**: ~85% (In-memory compute architecture; customer pays their own LLM token bills).

---

## Slide 7: Competitive Moat
| Feature | PermGate | Lakera / Robust AI | Pinecone / Weaviate | Naive Internal RAG |
| :--- | :---: | :---: | :---: | :---: |
| **Drop-in OpenAI SDK Format** | ✅ | ❌ | ❌ | ❌ |
| **Native Okta/Azure AD SCIM** | ✅ | ❌ | ❌ | ❌ |
| **Pre-Ingestion Zero Leakage** | ✅ | ⚠️ (Post-filter) | ❌ | ❌ |
| **Self-Hosted VPC (BYOC)** | ✅ | ❌ | ⚠️ (Cloud DB only) | ✅ (High Dev Cost) |
| **Deterministic SIEM Stream** | ✅ | ⚠️ | ❌ | ❌ |

---

## Slide 8: Go-To-Market Strategy
1. **Developer Open-Source Core**: Provide lightweight middleware on GitHub to drive inbound organic developer adoption.
2. **CISO Outbound Campaign**: Target Heads of AI and CISOs whose internal AI projects are blocked by compliance review.
3. **Design Partner Flywheel**: Convert 3 initial beta pilots into published case studies and annual contracts.

---

## Slide 9: Product Roadmap
* **Q1 2027**: Drop-in OpenAI Proxy + Okta SCIM Connector + Web Dashboard.
* **Q2 2027**: Self-Hosted Helm Chart + Splunk SIEM Integration + SOC 2 Type I.
* **Q3 2027**: Automated Data Connectors (Google Drive, SharePoint, Notion, Snowflake).
* **Q4 2027**: Fine-grained Attribute-Based Access Control (ABAC) with cryptographic enclave verification.

---

## Slide 10: The Ask
* **Raising**: **$1.5M - $2.0M Seed Round**.
* **Use of Funds**:
  * 60% Core Engineering (Distributed Systems & Cryptography Engineers).
  * 25% Go-To-Market (Enterprise Sales Lead & CISO Evangelism).
  * 15% SOC 2 Type II, Compliance, and Legal Infrastructure.
