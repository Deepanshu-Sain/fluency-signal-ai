import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import db from "@/lib/db";
import { randomUUID } from "crypto";

export const maxDuration = 30;

function detectVerificationSignal(content: string) {

  const verificationPatterns = [

    // Accuracy validation
    /\b(is this|is it|does this|does it)\s+(correct|accurate|right|valid|true)\b/i,

    /\b(can you|please)\s+(verify|check|confirm|validate|review)\b/i,


    // Fact checking
    /\b(source|evidence|proof|fact check|fact-check)\b/i,

    /\b(where did|how do we know|what is the source)\b/i,


    // Assumption checking
    /\b(am i|are we)\s+(assuming|missing|overlooking)\b/i,

    /\b(challenge|question|test)\s+(this|my|the)\s+(assumption|idea|claim)\b/i,


    // Critique/review behaviour
    /\b(review|critique|analyze|evaluate|find flaws|find issues)\b/i,

  ];


  return verificationPatterns.some(
    pattern => pattern.test(content)
  )
    ? 1
    : 0;

}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    sessionId?: string;
    messages?: UIMessage[];
  };

  if (!Array.isArray(body.messages)) {
    return Response.json(
      {
        error: "The request must include a messages array.",
      },
      {
        status: 400,
      }
    );
  }

  const sessionId = body.sessionId;


  if (!sessionId) {
    return Response.json(
      {
        error: "Session ID is required.",
      },
      {
        status: 400,
      }
    );
  }

  const latestMessage =
    body.messages[body.messages.length - 1];

  if (latestMessage?.role === "user") {
    const content = latestMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");

    const verificationSignal =
      detectVerificationSignal(content);

    db.prepare(`
      INSERT INTO chat_messages (
        id,
        session_id,
        role,
        content,
        verification_signal,
        created_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      randomUUID(),
      sessionId,
      "user",
      content,
      verificationSignal,
      new Date().toISOString()
    );
  }

  const result = streamText({
    model: google("gemini-3.1-flash-lite"),

    system: `
You are the Writing Assistant inside "The Fluency Signal" assessment app.

The user is completing this task:

Write a cold outreach email from Notion to Aarav Mehta, Head of Operations at Razorpay.
The goal is to introduce Notion AI as a solution for improving internal documentation,
knowledge sharing, and cross-team collaboration.

Your role is to collaborate with the user, not replace their thinking.

Adapt to what the user needs:
- If they ask for a draft, provide a draft.
- If they ask for feedback, critique their work.
- If they ask for ideas, brainstorm options.
- If they provide an assumption, question it when necessary.

Help the user:
- Brainstorm ideas.
- Suggest improvements.
- Review and critique their draft.
- Personalize messaging.
- Point out weak assumptions or unsupported claims.

Avoid asking unnecessary questions before helping.
If enough context exists, make a reasonable assumption and proceed.

Keep responses concise and actionable.
Prefer specific suggestions over generic sales advice.

Important constraints:
- Never invent customer examples, statistics, company facts, or claims about the prospect.
- If information is unknown, use cautious language or suggest verification.
- Keep initial responses compact.
- Do not provide long explanations unless the user asks for them.

When providing email text, format it clearly and make it easy for the user to copy/edit.
`,

    messages: await convertToModelMessages(body.messages ?? []),

    onFinish: async ({ text }) => {
      db.prepare(`
        INSERT INTO chat_messages (
          id,
          session_id,
          role,
          content,
          verification_signal,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        randomUUID(),
        sessionId,
        "assistant",
        text,
        0,
        new Date().toISOString()
      );
    },
  });

  return result.toUIMessageStreamResponse();
}