import db from "@/lib/db";
import { randomUUID } from "crypto";

export function createSession() {
  const id = randomUUID();

  const now = new Date().toISOString();

  const statement = db.prepare(`
    INSERT INTO sessions (
      id,
      created_at,
      updated_at
    )
    VALUES (?, ?, ?)
  `);

  statement.run(id, now, now);

  return {
    id,
    createdAt: now,
    updatedAt: now,
  };
}