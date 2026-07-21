import { createEmailVersion } from "@/lib/emailService";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    sessionId?: string;
    content?: string;
    changedWords?: number;
  };


  if (!body.sessionId) {
    return Response.json(
      {
        error: "Session ID is required.",
      },
      {
        status: 400,
      }
    );
  }


  if (!body.content) {
    return Response.json(
      {
        error: "Email content is required.",
      },
      {
        status: 400,
      }
    );
  }


  const version = createEmailVersion(
    body.sessionId,
    body.content,
    body.changedWords ?? 0
  );


  return Response.json(version);
}