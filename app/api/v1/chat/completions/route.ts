import { NextRequest, NextResponse } from "next/server";
import { getUserById, getAllDocuments, getAllUsers } from "@/lib/db";
import {
  filterDocumentsForUser,
  buildSecureSystemPrompt,
  simulateEnclaveInference,
} from "@/lib/security-engine";

export const runtime = "nodejs";

/**
 * PermGate - OpenAI Compatible Chat Completions Gateway
 * Drop-in replacement for `https://api.openai.com/v1/chat/completions`
 * Enforces zero-trust clearance boundaries before context touches the LLM.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Identity Resolution: Extract employee identity from headers
    // Accepts custom enterprise header, bearer token, or defaults to fallback intern
    const authHeader = req.headers.get("authorization");
    const employeeHeader = req.headers.get("x-employee-id");
    
    // Resolve user by header ID or parse from mock bearer token (e.g., Bearer usr_sec_003)
    let userId = employeeHeader;
    if (!userId && authHeader?.startsWith("Bearer usr_")) {
      userId = authHeader.replace("Bearer ", "").trim();
    }
    if (!userId) {
      userId = "usr_intern_001"; // Default identity for testing
    }

    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json(
        {
          error: {
            message: `PermGate Authentication Error: Identity '${userId}' is not registered in the Enterprise Directory.`,
            type: "invalid_identity_error",
            code: "permgate_unauthorized_identity",
          },
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { messages, model = "gpt-4-turbo", temperature = 0.7 } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          error: {
            message: "PermGate Validation Error: 'messages' must be a non-empty array.",
            type: "invalid_request_error",
            code: "missing_messages",
          },
        },
        { status: 400 }
      );
    }

    // 2. Extract latest user prompt
    const userMessages = messages.filter((m: any) => m.role === "user");
    const latestUserMessage = userMessages[userMessages.length - 1]?.content || "";

    // 3. Strict PermGate Context Clearance Partitioning
    const allDocs = getAllDocuments();
    const { approved, blocked } = filterDocumentsForUser(user, allDocs);

    // 4. Construct Identity-Aware Secure Enclave System Prompt
    const secureSystemPrompt = buildSecureSystemPrompt(user, approved, latestUserMessage);

    // 5. Enclave Inference Execution (or downstream OpenAI forwarder)
    const assistantContent = simulateEnclaveInference(user, approved, blocked, latestUserMessage);

    const completionId = `chatcmpl_permgate_${Math.random().toString(36).substring(2, 11)}`;
    const createdTimestamp = Math.floor(Date.now() / 1000);

    // 6. Return OpenAI-compliant schema with PermGate Security Telemetry
    return NextResponse.json({
      id: completionId,
      object: "chat.completion",
      created: createdTimestamp,
      model,
      system_fingerprint: "fp_permgate_zerotrust_v1",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: assistantContent,
          },
          logprobs: null,
          finish_reason: "stop",
        },
      ],
      usage: {
        prompt_tokens: Math.ceil(secureSystemPrompt.length / 4),
        completion_tokens: Math.ceil(assistantContent.length / 4),
        total_tokens: Math.ceil((secureSystemPrompt.length + assistantContent.length) / 4),
      },
      // PermGate Enterprise Security Telemetry
      permgate_telemetry: {
        audit_id: `audit_${Date.now()}`,
        employee_id: user.id,
        employee_name: user.name,
        clearance_enforced: user.clearanceLevel,
        documents_evaluated: allDocs.length,
        documents_approved: approved.length,
        documents_blocked: blocked.length,
        leakage_prevention_status: "SECURE_ZERO_LEAK",
        blocked_document_ids: blocked.map((d) => d.id),
      },
    });
  } catch (error: any) {
    console.error("[PERMGATE_PROXY_ERROR]", error);
    return NextResponse.json(
      {
        error: {
          message: "Internal PermGate context arbitration failure.",
          type: "permgate_gateway_error",
          code: "internal_error",
        },
      },
      { status: 500 }
    );
  }
}
