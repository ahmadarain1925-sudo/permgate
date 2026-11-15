/**
 * AI Permission Firewall - Database Layer & Schema Definitions
 * Provides strictly typed Mock Storage for Enterprise Users and Clearance-Classified Documents.
 */

export type ClearanceLevel = 1 | 2 | 3 | 4 | 5;

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  clearanceLevel: ClearanceLevel;
  department: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  requiredClearance: ClearanceLevel;
  classificationName: "UNCLASSIFIED" | "CONFIDENTIAL" | "SECRET" | "TOP SECRET" | "EXECUTIVE COMPARTMENT";
  category: "HR" | "Operations" | "Engineering" | "Security" | "Executive" | "Financial";
  lastUpdated: string;
}

// 5 Distinct Enterprise Personas mapping to Clearances 1 through 5
export const MOCK_USERS: User[] = [
  {
    id: "usr_intern_001",
    name: "Alex Miller",
    email: "alex.miller@enterprise.internal",
    role: "Contract Engineering Intern",
    clearanceLevel: 1,
    department: "Frontend Labs",
  },
  {
    id: "usr_dev_002",
    name: "Sarah Chen",
    email: "sarah.chen@enterprise.internal",
    role: "Junior Full-Stack Developer",
    clearanceLevel: 2,
    department: "Application Services",
  },
  {
    id: "usr_sec_003",
    name: "Marcus Vance",
    email: "marcus.vance@enterprise.internal",
    role: "Lead Infrastructure & AppSec Architect",
    clearanceLevel: 3,
    department: "Information Security",
  },
  {
    id: "usr_vp_004",
    name: "Dr. Elena Rostova",
    email: "elena.rostova@enterprise.internal",
    role: "VP of Research & Core Intelligence",
    clearanceLevel: 4,
    department: "Executive R&D",
  },
  {
    id: "usr_ceo_005",
    name: "David Sterling",
    email: "david.sterling@enterprise.internal",
    role: "Chief Executive Officer & Board Director",
    clearanceLevel: 5,
    department: "Office of the CEO",
  },
];

// 10 Corporate Knowledge Documents tiered from Public Cafeteria Menu (1) to Board Layoff Matrix (5)
export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "doc_001",
    title: "Cafeteria Menu & Weekly Catering Specials",
    content: "Monday: Artisanal Sourdough Paninis & Tomato Bisque. Tuesday: Baja Street Tacos. Wednesday: Mediterranean Falafel Bowls. Friday: Wood-fired Pizza. Cafeteria operates 11:30 AM - 2:00 PM on Building 4, Floor 1.",
    requiredClearance: 1,
    classificationName: "UNCLASSIFIED",
    category: "Operations",
    lastUpdated: "2026-11-01",
  },
  {
    id: "doc_002",
    title: "General Remote Work & Hybrid Work Schedule",
    content: "Enterprise policy allows hybrid scheduling (2 remote days/week with manager sign-off). Standard core hours are 10:00 AM to 4:00 PM EST. All remote access requires registered YubiKey hardware 2FA and corporate MDM installation.",
    requiredClearance: 1,
    classificationName: "UNCLASSIFIED",
    category: "HR",
    lastUpdated: "2026-10-15",
  },
  {
    id: "doc_003",
    title: "Standard Developer Onboarding & Git Workflow",
    content: "Engineers must enforce trunk-based development with branch protection on `main`. All PRs require two senior peer approvals, green CI security scanning, and automated SonarQube static analysis threshold > 85%.",
    requiredClearance: 2,
    classificationName: "CONFIDENTIAL",
    category: "Engineering",
    lastUpdated: "2026-10-22",
  },
  {
    id: "doc_004",
    title: "Tier-2 Customer Escalation Procedures",
    content: "Enterprise SLA requires Sev-1 outages to be acknowledged within 15 minutes. Contact on-call Incident Commander via PagerDuty rotation '#app-critical'. Use Incident Bridge Zoom Room 883-991-002 for live coordination.",
    requiredClearance: 2,
    classificationName: "CONFIDENTIAL",
    category: "Operations",
    lastUpdated: "2026-09-18",
  },
  {
    id: "doc_005",
    title: "Production Infrastructure Topology & Zero-Trust Mesh",
    content: "AWS Production VPC resides in us-east-1 and eu-central-1 behind Cloudflare Magic Transit. Internal cluster communication relies on Istio Mutual TLS with automated SPIFFE/SPIRE x509 cert rotation every 6 hours. Bastion host access disabled in favor of Teleport Zero-Trust SSO.",
    requiredClearance: 3,
    classificationName: "SECRET",
    category: "Security",
    lastUpdated: "2026-11-04",
  },
  {
    id: "doc_006",
    title: "Quarterly Penetration Test Vulnerability Remediation",
    content: "Red Team penetration test identified residual blind SSRF in Legacy PDF Generation Microservice (CVE-2026-PENDING). Patch v4.2.1 is isolated to VPC subnet 10.42.0.0/16 with strict egress filtering until deprecation in December.",
    requiredClearance: 3,
    classificationName: "SECRET",
    category: "Security",
    lastUpdated: "2026-10-30",
  },
  {
    id: "doc_007",
    title: "Project Apollo: Autonomous Synthetic Intelligence Engine",
    content: "Apollo represents the next-generation autonomous model fine-tuning pipeline. Utilizes proprietary multi-agent reflection loops with internal inference latency under 12ms. Patent pending application #US-2026-0049129 covers the distributed permission arbitration kernel.",
    requiredClearance: 4,
    classificationName: "TOP SECRET",
    category: "Engineering",
    lastUpdated: "2026-11-08",
  },
  {
    id: "doc_008",
    title: "Q4 Mergers & Strategic Acquisition Target Shortlist",
    content: "Projected $45M all-cash acquisition target: 'NeuralFence Inc.' targeting their kernel-level vector sanitization patents. Term sheet drafted by Wilson Sonsini; diligence closing scheduled for December 18, 2026.",
    requiredClearance: 4,
    classificationName: "TOP SECRET",
    category: "Financial",
    lastUpdated: "2026-11-05",
  },
  {
    id: "doc_009",
    title: "CEO Q4 Layoff Plans & Executive Restructuring Matrix",
    content: "HIGHLY CONFIDENTIAL / BOARD EYES ONLY: Executive reorganization scheduled for December 2026 will eliminate 18% of global headcount primarily within legacy non-AI product lines. Severance package capped at 14 weeks base + 6 months health coverage. Communication blackout enforced until Dec 1st board vote.",
    requiredClearance: 5,
    classificationName: "EXECUTIVE COMPARTMENT",
    category: "Executive",
    lastUpdated: "2026-11-09",
  },
  {
    id: "doc_010",
    title: "Sovereign Board Governance & Zero-Day Reserve Vault",
    content: "Offline air-gapped cryptographic hardware storage protocols for emergency corporate shutdown, defensive patent licensing disputes, and institutional treasury key recovery split via Shamir's Secret Sharing (3-of-5 board members required).",
    requiredClearance: 5,
    classificationName: "EXECUTIVE COMPARTMENT",
    category: "Executive",
    lastUpdated: "2026-11-02",
  },
];

// Helper functions for data access
export function getUserById(id: string): User | undefined {
  return MOCK_USERS.find((user) => user.id === id);
}

export function getAllUsers(): User[] {
  return MOCK_USERS;
}

export function getAllDocuments(): Document[] {
  return MOCK_DOCUMENTS;
}
