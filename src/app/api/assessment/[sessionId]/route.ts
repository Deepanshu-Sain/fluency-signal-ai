import { getAssessmentSignals } from "@/lib/assessmentService";
import { getReportData } from "@/lib/reportService";
import { generateEvaluationFeedback } from "@/lib/evaluatorService";
import db from "@/lib/db";


export async function GET(
  req: Request,
  context: {
    params: Promise<{
      sessionId: string;
    }>;
  }
) {

  const { sessionId } =
    await context.params;



  if (!sessionId) {

    return Response.json(
      {
        error:
          "Session ID is required.",
      },
      {
        status: 400,
      }
    );

  }



  try {


    const session =
      db
        .prepare(`
          SELECT id
          FROM sessions
          WHERE id = ?
        `)
        .get(sessionId);



    if (!session) {

      return Response.json(
        {
          error:
            "Session not found.",
        },
        {
          status: 404,
        }
      );

    }



    const assessment =
      getAssessmentSignals(
        sessionId
      );



    const reportData =
      getReportData(
        sessionId
      );



    let feedback;



    try {


      feedback =
        await generateEvaluationFeedback({

          signals:
            assessment.signals,

          conversation:
            reportData.conversation,

          finalDraft:
            reportData.finalDraft,

        });



    } catch(error) {


      console.error(
        "Evaluator failed:",
        error
      );



      feedback = {

        summary:
          "AI evaluation could not be completed.",


        strengths: [],


        improvements: [
          "Continue reviewing and improving your AI collaboration process."
        ],

      };


    }




    return Response.json({

      ...assessment,

      feedback,

    });



  } catch(error) {


    console.error(
      "Assessment generation failed:",
      error
    );



    return Response.json(

      {
        error:
          "Unable to generate assessment report.",
      },

      {
        status: 500,
      }

    );

  }

}