import { NextRequest, NextResponse } from "next/server";
import { getUserById, getAllDocuments } from "@/lib/db";
import {
  filterDocumentsForUser,
  buildSecureSystemPrompt,
  simulateEnclaveInference,
} from "@/lib/security-engine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userPrompt } = body;

    // Validate parameters
    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'userId' in request body." },
        { status: 400 }
      );
    }

    if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'userPrompt' in request body." },
        { status: 400 }
      );
    }

    // 1. Identity Resolution
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: `User with ID '${userId}' not found in identity registry.` },
        { status: 404 }
      );
    }

    // 2. Fetch enterprise corpus
    const allDocuments = getAllDocuments();

    // 3. Strict Firewall Clearance Enforcement
    const { approved, blocked } = filterDocumentsForUser(user, allDocuments);

    // 4. Construct Secure System Prompt
    const secureSystemPrompt = buildSecureSystemPrompt(user, approved, userPrompt);

    // 5. Execute Enclave Inference Simulation
    const llmResponse = simulateEnclaveInference(user, approved, blocked, userPrompt);

    // 6. Return Structured Secure Payload
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      requestId: `req_${Math.random().toString(36).substring(2, 10)}`,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        department: user.department,
        clearanceLevel: user.clearanceLevel,
      },
      stats: {
        totalEvaluated: allDocuments.length,
        approvedCount: approved.length,
        blockedCount: blocked.length,
        redactionPercentage: `${((blocked.length / allDocuments.length) * 100).toFixed(1)}%`,
      },
      approvedDocuments: approved,
      blockedDocuments: blocked,
      secureSystemPrompt,
      llmResponse,
    });
  } catch (error: any) {
    console.error("[FIREWALL_API_ERROR]", error);
    return NextResponse.json(
      {
        error: "Internal security firewall processing failure.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
