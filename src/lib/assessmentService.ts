import db from "@/lib/db";


export function getAssessmentSignals(sessionId: string) {


  const promptCount =
    db
      .prepare(`
        SELECT COUNT(*) as count
        FROM chat_messages
        WHERE session_id = ?
        AND role = 'user'
      `)
      .get(sessionId) as {
        count:number;
      };



  const verificationSignals =
    db
      .prepare(`
        SELECT COUNT(*) as count
        FROM chat_messages
        WHERE session_id = ?
        AND verification_signal = 1
      `)
      .get(sessionId) as {
        count:number;
      };



  const totalVersions =
    db
      .prepare(`
        SELECT COUNT(*) as count
        FROM email_versions
        WHERE session_id = ?
      `)
      .get(sessionId) as {
        count:number;
      };



  const totalEdits =
    db
      .prepare(`
        SELECT COUNT(*) as count
        FROM edit_events
        WHERE session_id = ?
      `)
      .get(sessionId) as {
        count:number;
      };



  const meaningfulEdits =
    db
      .prepare(`
        SELECT COUNT(*) as count
        FROM edit_events
        WHERE session_id = ?
        AND meaningful = 1
      `)
      .get(sessionId) as {
        count:number;
      };



  /*
    Edit Ratio

    Represents the percentage of the draft
    changed across revision history.

    Range:
    0 - 1

    Example:
    0.45 = 45% of draft changed
  */


  const editRatioResult =
    db
      .prepare(`
        SELECT COALESCE(
          SUM(edit_ratio_contribution),
          0
        ) as ratio
        FROM edit_events
        WHERE session_id = ?
      `)
      .get(sessionId) as {
        ratio:number;
      };



  const editRatio =
    Number(
      Math.min(
        1,
        editRatioResult.ratio
      ).toFixed(2)
    );



  /*
    Collaboration Score

    Primary assignment signals:

    Prompt Count       25
    Verification       25
    Interaction depth  50
  */


  const promptScore =
    promptCount.count >= 3
      ? 25
      : promptCount.count === 2
      ? 18
      : promptCount.count === 1
      ? 10
      : 0;



  const verificationScore =
    verificationSignals.count >= 2
      ? 25
      : verificationSignals.count === 1
      ? 15
      : 0;



  const interactionScore =
    promptCount.count >= 4
      ? 50
      : promptCount.count >= 2
      ? 35
      : promptCount.count === 1
      ? 20
      : 0;



  const collaborationScore =
    Math.min(
      100,
      promptScore +
      verificationScore +
      interactionScore
    );



  /*
    Revision Score

    Edit Ratio     80%
    Meaningful edits 20%
  */


  const cappedEditRatio =
  Math.min(
    editRatio,
    0.6
  );


const editDepthScore =
  Math.round(
    cappedEditRatio * 80
  );



  const meaningfulEditScore =
    meaningfulEdits.count > 0
      ? 20
      : 0;



  const iterationScore =
    Math.min(
      100,
      editDepthScore +
      meaningfulEditScore
    );



  const overallScore =
    Math.round(
      collaborationScore * 0.5 +
      iterationScore * 0.5
    );



  const strengths:string[] = [];
  const improvements:string[] = [];



  if(promptCount.count >= 3){

    strengths.push(
      "Used AI through multiple interaction cycles."
    );

  } else {

    improvements.push(
      "Use AI more for exploration and refinement."
    );

  }



  if(verificationSignals.count > 0){

    strengths.push(
      "Verified information before finalizing decisions."
    );

  } else {

    improvements.push(
      "Add verification steps for important information."
    );

  }



  if(editRatio >= 0.25){

    strengths.push(
      "Substantially revised the draft after iteration."
    );

  } else {

    improvements.push(
      "Make deeper revisions after receiving feedback."
    );

  }



  return {

    signals:{

      promptCount:
        promptCount.count,

      verificationSignals:
        verificationSignals.count,

      editRatio,

      totalVersions:
        totalVersions.count,

      totalEdits:
        totalEdits.count,

      meaningfulEdits:
        meaningfulEdits.count,

    },


    scores:{

      collaborationScore,

      iterationScore,

      overallScore,

    },


    insights:{

      strengths,

      improvements,

    },

  };

}