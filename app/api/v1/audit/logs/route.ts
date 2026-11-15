import { NextRequest, NextResponse } from "next/server";
import { MOCK_USERS, MOCK_DOCUMENTS } from "@/lib/db";

export const runtime = "nodejs";

/**
 * PermGate - SIEM & Audit Telemetry Export API
 * Allows CISOs and SecOps teams to stream security events to Splunk, Datadog, or AWS CloudWatch.
 */
export async function GET(req: NextRequest) {
  const events = [
    {
      id: "evt_991823",
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      action: "LLM_CONTEXT_FILTER_ENFORCED",
      status: "SECURITY_BLOCK",
      severity: "CRITICAL",
      user: {
        id: "usr_intern_001",
        name: "Alex Miller",
        role: "Contract Engineering Intern",
        clearanceLevel: 1,
      },
      violationDetails: {
        attemptedQuery: "What are the CEO Q4 layoff plans?",
        restrictedDocumentTargeted: "doc_009 (CEO Q4 Layoff Plans & Executive Restructuring Matrix)",
        documentClearance: 5,
        userClearance: 1,
        clearanceDelta: 4,
      },
      firewallAction: "STRIPPED_FROM_CONTEXT_WINDOW",
      zeroLeakageVerified: true,
    },
    {
      id: "evt_991822",
      timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      action: "LLM_CONTEXT_FILTER_ENFORCED",
      status: "SECURITY_BLOCK",
      severity: "HIGH",
      user: {
        id: "usr_dev_002",
        name: "Sarah Chen",
        role: "Junior Full-Stack Developer",
        clearanceLevel: 2,
      },
      violationDetails: {
        attemptedQuery: "Show me production VPC Istio network topology and Teleport access",
        restrictedDocumentTargeted: "doc_005 (Production Infrastructure Topology & Zero-Trust Mesh)",
        documentClearance: 3,
        userClearance: 2,
        clearanceDelta: 1,
      },
      firewallAction: "STRIPPED_FROM_CONTEXT_WINDOW",
      zeroLeakageVerified: true,
    },
    {
      id: "evt_991821",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      action: "LLM_CONTEXT_FILTER_ENFORCED",
      status: "CLEARANCE_VERIFIED",
      severity: "INFO",
      user: {
        id: "usr_ceo_005",
        name: "David Sterling",
        role: "Chief Executive Officer & Board Director",
        clearanceLevel: 5,
      },
      violationDetails: null,
      firewallAction: "PASSED_FULL_CONTEXT",
      zeroLeakageVerified: true,
    },
  ];

  return NextResponse.json({
    service: "PermGate Enterprise Audit Service",
    version: "1.0.0",
    complianceCertification: "SOC 2 Type II / HIPAA BAA Ready",
    siemTarget: "Splunk / Datadog / AWS EventBridge",
    totalEvents: events.length,
    events,
  });
}
