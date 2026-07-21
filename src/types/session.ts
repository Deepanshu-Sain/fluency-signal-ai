export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface EmailSnapshot {
  id: string;
  content: string;
  createdAt: Date;
  changedWords: number;
}

export interface Session {
  id: string;
  messages: ChatMessage[];
  emailSnapshots: EmailSnapshot[];
  finalEmail?: string;
  createdAt: Date;
}