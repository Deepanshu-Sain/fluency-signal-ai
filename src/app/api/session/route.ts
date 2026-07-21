import { createSession } from "@/lib/sessionService";

export async function POST() {
  const session = createSession();

  return Response.json(session);
}