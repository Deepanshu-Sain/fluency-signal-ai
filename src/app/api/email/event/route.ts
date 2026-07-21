import { createEditEvent } from "@/lib/emailService";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    sessionId?: string;
    previousVersionId?: string | null;
    newVersionId?: string;
    charactersChanged?: number;
    editRatioContribution?: number;
    meaningful?: boolean;
  };


  if (!body.sessionId || !body.newVersionId) {
    return Response.json(
      {
        error:
          "Session ID and new version ID are required.",
      },
      {
        status: 400,
      }
    );
  }


  const event = createEditEvent(
    body.sessionId,
    body.previousVersionId ?? null,
    body.newVersionId,
    body.charactersChanged ?? 0,
    body.editRatioContribution ?? 0,
    body.meaningful ?? false
  );


  return Response.json(event);
}