# PermGate: Enterprise Outreach & Sales Playbook
> Proven outreach sequences, objection-handling scripts, and 1-page tear sheet to land your first 3 enterprise design partners.

---

## 1. LinkedIn Direct Message Sequences

### Target: Head of AI / VP of Engineering
* **Connection Request Note (under 300 characters)**:
  > *"Hi [First Name] - saw you're leading AI/RAG initiatives at [Company]. Most engineering leaders we talk to get their internal LLMs delayed by security reviews over clearance leaks. Built a lightweight drop-in proxy that solves this with zero code changes. Would love to connect!"*

* **Follow-Up Message (After they accept)**:
  > *"Hi [First Name], thanks for connecting.*
  >
  > *The biggest friction point we see when teams roll out internal AI is: 'How do we stop an intern or contractor from retrieving executive compensation or board records through vector search?'*
  >
  > *We built **PermGate** (permgate.com) — a drop-in OpenAI-compatible proxy that syncs with Okta/Azure AD to strictly partition document context by employee clearance level BEFORE it reaches the LLM.*
  >
  > *Recorded a 60-second sandbox walkthrough here: [Loom Link]*
  >
  > *Are you free for 10 minutes this Thursday to see if this could unblock your team's security approval?*
  >
  > *Best,*  
  > *[Your Name]*  
  > *Founder, PermGate"*

---

### Target: CISO / VP of Information Security
* **Cold Message**:
  > *"Subject: Eliminating clearance data leakage in your company's GenAI context window*
  >
  > *Hi [First Name],*
  >
  > *As employees adopt internal LLMs, traditional IAM/RBAC often breaks down at the vector retrieval layer, creating a major cross-departmental data leakage hazard.*
  >
  > *PermGate is an identity-aware firewall that ensures models never ingest documents above an employee's verified clearance level.*
  >
  > *Key facts for your SecOps team:*
  > * *Zero Data Retention (all processing is stateless and in-memory).*
  > * *Can run entirely inside your own AWS/Azure VPC (Bring-Your-Own-Cloud).*
  > * *Streams blocked clearance attempts directly to Splunk and Datadog.*
  >
  > *Open to a 10-minute briefing next Tuesday?*
  >
  > *Best regards,*  
  > *[Your Name]"*

---

## 2. Cold Email Campaign

### Email 1: The Pain Point
> **Subject**: unblocking [Company]'s internal RAG from security review  
>
> Hi **[First Name]**,  
>
> Quick question: as your team builds out internal AI tools, how are you ensuring that employees only receive answers generated from documents they have clearance to see?  
>
> Most teams find that semantic vector search accidentally surfaces confidential HR salaries, M&A notes, or board docs to non-authorized staff.  
>
> We built **PermGate** — an identity-aware LLM proxy that enforces clearance levels directly against Okta before context reaches OpenAI or Anthropic.  
>
> It drops in with 1 line of code:  
> `baseURL: "https://api.permgate.com/v1"`  
>
> We are onboarding 3 design partners this month with direct Slack support and zero setup fee.  
>
> Are you open to a 10-minute demo on Wednesday at 2pm?  
>
> Best,  
> **[Your Name]**  
> Founder, PermGate (permgate.com)

---

### Email 2: The Bump (Send 3 days later)
> **Subject**: Re: unblocking [Company]'s internal RAG from security review  
>
> Hi **[First Name]**,  
>
> Just wanted to share a 45-second interactive sandbox video of PermGate in action: **[Loom Link]**  
>
> It shows an intern asking for CEO layoff plans getting blocked with 0 token leakage, while the CEO runs the same query with full clearance verified.  
>
> Worth 10 minutes to see if this fits your 2027 AI security roadmap?  
>
> Best,  
> **[Your Name]**

---

## 3. CISO Objection-Handling Guide

| Objection | How to Answer |
| :--- | :--- |
| *"We can't send our company prompts to a third-party cloud."* | **Response**: *"Completely agree. PermGate is architected for zero-data retention, and we offer a self-hosted Docker / Kubernetes Helm chart that deploys directly into your private AWS or Azure VPC. Your tokens never leave your network."* |
| *"Why can't our developers just write filtering logic themselves?"* | **Response**: *"They can, but handling clearance across nested documents, Slack channels, and changing Okta groups is notoriously error-prone. A single bug leaks board files. PermGate provides a battle-tested, SOC 2 compliant enclave with automated SIEM audit logging out of the box."* |
| *"Does this add significant latency to LLM responses?"* | **Response**: *"PermGate's in-memory permission arbitration adds under 15 milliseconds of latency—virtually unnoticeable compared to typical 1,500ms LLM inference times."* |
| *"Does this protect against prompt injections like DAN?"* | **Response**: *"Yes, 100%. Post-generation guardrails fail against prompt injections because the model has already ingested the secret. PermGate strips the restricted documents before prompt concatenation, making it mathematically impossible for the LLM to reveal data it never received."* |
