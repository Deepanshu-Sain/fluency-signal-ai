import db from "@/lib/db";
import { randomUUID } from "crypto";


export function createEmailVersion(
  sessionId: string,
  content: string,
  changedWords: number
) {
  const id = randomUUID();

  const now = new Date().toISOString();


  db.prepare(`
    INSERT INTO email_versions (
      id,
      session_id,
      content,
      word_count,
      created_at
    )
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    sessionId,
    content,
    changedWords,
    now
  );


  return {
    id,
    sessionId,
    content,
    changedWords,
    createdAt: now,
  };
}



export function createEditEvent(
  sessionId: string,
  previousVersionId: string | null,
  newVersionId: string,
  charactersChanged: number,
  editRatioContribution: number,
  meaningful: boolean
) {
  const id = randomUUID();

  const now = new Date().toISOString();


  db.prepare(`
    INSERT INTO edit_events (
      id,
      session_id,
      previous_version_id,
      new_version_id,
      characters_changed,
      edit_ratio_contribution,
      meaningful,
      created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    sessionId,
    previousVersionId,
    newVersionId,
    charactersChanged,
    editRatioContribution,
    meaningful ? 1 : 0,
    now
  );


  return {
    id,
    sessionId,
    previousVersionId,
    newVersionId,
    charactersChanged,
    editRatioContribution,
    meaningful,
    createdAt: now,
  };
}