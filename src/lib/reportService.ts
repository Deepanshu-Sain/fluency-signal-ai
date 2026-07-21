import db from "@/lib/db";

export function getReportData(sessionId: string) {
  const messages = db
    .prepare(`
      SELECT role, content
      FROM chat_messages
      WHERE session_id = ?
      ORDER BY created_at ASC
    `)
    .all(sessionId) as {
      role: string;
      content: string;
    }[];

  const latestDraft = db
    .prepare(`
      SELECT content
      FROM email_versions
      WHERE session_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    `)
    .get(sessionId) as {
      content: string;
    } | undefined;


  const conversation = messages
    .map(
      (message) =>
        `${message.role}: ${message.content}`
    )
    .join("\n\n");


  return {
    conversation:
      conversation ||
      "No conversation history was recorded.",

    finalDraft:
      latestDraft?.content ??
      "No final draft was created.",
  };
}