import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(
  process.cwd(),
  "fluency.db"
);

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.pragma("foreign_keys = ON");


db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );


  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    verification_signal INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY(session_id)
      REFERENCES sessions(id)
      ON DELETE CASCADE
  );


  CREATE TABLE IF NOT EXISTS email_versions (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    content TEXT NOT NULL,
    word_count INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(session_id)
      REFERENCES sessions(id)
      ON DELETE CASCADE
  );


  CREATE TABLE IF NOT EXISTS edit_events (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    previous_version_id TEXT,
    new_version_id TEXT NOT NULL,
    characters_changed INTEGER NOT NULL,
    edit_ratio_contribution REAL NOT NULL DEFAULT 0,
    meaningful INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(session_id)
      REFERENCES sessions(id)
      ON DELETE CASCADE
  );
`);


// -----------------------------
// Database migrations
// -----------------------------

function columnExists(
  tableName: string,
  columnName: string
) {
  const columns = db
    .prepare(
      `PRAGMA table_info(${tableName})`
    )
    .all() as {
      name: string;
    }[];

  return columns.some(
    (column) =>
      column.name === columnName
  );
}


if (
  !columnExists(
    "edit_events",
    "edit_ratio_contribution"
  )
) {
  db.exec(`
    ALTER TABLE edit_events
    ADD COLUMN edit_ratio_contribution REAL NOT NULL DEFAULT 0;
  `);
}


export default db;