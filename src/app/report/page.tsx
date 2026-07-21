"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  ShieldCheck,
  Pencil,
  Bot,
  RefreshCw,
} from "lucide-react";

type Assessment = {

  signals: {
    promptCount:number;
    verificationSignals:number;
    editRatio:number;
  };

  scores:{
    collaborationScore:number;
    iterationScore:number;
    overallScore:number;
  };

  feedback?:{
    summary:string;
    strengths:string[];
    improvements:string[];
  };

};





function scoreDescription(score:number){

  if(score >= 85)
    return "Excellent AI collaboration with strong iteration habits.";

  if(score >= 70)
    return "Strong collaboration with opportunities to refine further.";

  if(score >= 50)
    return "Developing AI collaboration patterns.";

  return "More intentional AI usage can improve your workflow.";

}







function MetricCard({
  title,
  value,
  description,
  icon,
}:{
  title:string;
  value:string;
  description:string;
  icon: React.ReactNode;
}){


  return (

    <div
      className="
        rounded-2xl
        border
        border-zinc-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-md
      "
    >

      <div
        className="
          flex
          items-center
          justify-between
        "
      >

        <p
          className="
            text-sm
            font-medium
            text-zinc-500
          "
        >
          {title}
        </p>


        <div
  className="
    flex
    h-9
    w-9
    items-center
    justify-center
    rounded-lg
    bg-zinc-100
    text-zinc-600
  "
>
  {icon}
</div>


      </div>




      <p
        className="
          mt-5
          text-4xl
          font-semibold
          tracking-tight
          text-zinc-900
        "
      >
        {value}
      </p>




      <p
        className="
          mt-3
          text-sm
          leading-5
          text-zinc-600
        "
      >
        {description}
      </p>


    </div>

  );

}







function FeedbackCard({
  title,
  icon,
  items,
  type,
}:{
  title:string;
  icon:string;
  items:string[];
  type:"strength"|"improvement";
}){


  const empty =
    items.length === 0;



  return (

    <div
      className={`
        rounded-2xl
        border
        p-5
        ${
          type==="strength"
          ?
          "border-emerald-200 bg-emerald-50/40"
          :
          "border-amber-200 bg-amber-50/40"
        }
      `}
    >


      <div
        className="
          flex
          items-center
          gap-2
        "
      >

        <span>
          {icon}
        </span>


        <h3
          className="
            font-medium
            text-zinc-900
          "
        >
          {title}
        </h3>


      </div>





      {
        empty ?

        (

          <p
            className="
              mt-4
              text-sm
              text-zinc-500
            "
          >
            No signals observed yet.
          </p>

        )

        :

        (

          <ul
            className="
              mt-4
              space-y-3
              text-sm
              text-zinc-700
            "
          >

            {
              items.map(
                (item,index)=>(

                  <li
                    key={index}
                    className="
                      flex
                      gap-2
                    "
                  >

                    <span>
                      {type==="strength" ? "✓" : "→"}
                    </span>

                    <span>
                      {item}
                    </span>

                  </li>

                )
              )
            }

          </ul>

        )

      }


    </div>

  );

}






export default function ReportPage(){


  const router = useRouter();


  const [
    assessment,
    setAssessment
  ] =
  useState<Assessment|null>(null);





  useEffect(()=>{


    async function load(){


      const sessionId =
        localStorage.getItem(
          "fluency-session-id"
        );



      if(!sessionId)
        return;




      const response =
        await fetch(
          `/api/assessment/${sessionId}`
        );



      const data =
        await response.json();



      setAssessment(data);


    }



    load();


  },[]);






  function startNewAssessment(){


    localStorage.removeItem(
      "fluency-session-id"
    );


    localStorage.removeItem(
      "fluency-session-completed"
    );


    router.push("/");


  }
    if(!assessment){

    return (

      <main
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-zinc-50
        "
      >

        <p className="text-zinc-500">
          Preparing your assessment report...
        </p>

      </main>

    );

  }




  const progress =
    assessment.scores.overallScore;



  return (

    <main
      className="
        min-h-screen
        bg-zinc-50
        px-6
        py-12
        text-zinc-900
      "
    >


      <div
        className="
          mx-auto
          max-w-5xl
          space-y-8
        "
      >



        {/* Header */}

        <header>

          <p
            className="
              text-sm
              font-medium
              text-zinc-500
            "
          >
            AI Collaboration Assessment
          </p>


          <h1
            className="
              mt-2
              text-4xl
              font-semibold
              tracking-tight
            "
          >
            Fluency Signal Report
          </h1>


          <p
            className="
              mt-3
              text-zinc-600
            "
          >
            Measuring how effectively you collaborate with AI during a
            real-world writing task.
          </p>


        </header>








        {/* Overall Score */}

        <section
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white
            p-8
            shadow-sm
          "
        >


          <p
            className="
              text-sm
              font-medium
              text-zinc-500
            "
          >
            Overall Collaboration Score
          </p>




          <div
            className="
              mt-5
              flex
              items-end
              gap-3
            "
          >

            <span
              className="
                text-7xl
                font-semibold
                tracking-tight
              "
            >
              {
                assessment.scores.overallScore
              }
            </span>


            <span
              className="
                mb-4
                text-2xl
                text-zinc-400
              "
            >
              /100
            </span>


          </div>




          <p
            className="
              mt-4
              max-w-xl
              text-zinc-600
            "
          >
            {
              scoreDescription(
                assessment.scores.overallScore
              )
            }
          </p>




          <div
            className="
              mt-6
              h-2
              overflow-hidden
              rounded-full
              bg-zinc-100
            "
          >

            <div
              className="
                h-full
                rounded-full
                bg-black
                transition-all
              "
              style={{
                width:`${progress}%`
              }}
            />

          </div>


        </section>









        {/* Collaboration Signals */}

        <section>


          <h2
            className="
              mb-4
              text-xl
              font-semibold
            "
          >
            Collaboration Signals
          </h2>



          <div
            className="
              grid
              gap-5
              md:grid-cols-3
            "
          >


            <MetricCard

              icon={
                    <MessageSquare
                    size={18}
                    strokeWidth={1.8}
                    />
                }

              title="Prompt Count"

              value={
                String(
                  assessment.signals.promptCount
                )
              }

              description="AI interactions during the task."

            />



            <MetricCard

              icon={
  <ShieldCheck
    size={18}
    strokeWidth={1.8}
  />
}

              title="Verification Signals"

              value={
                String(
                  assessment.signals.verificationSignals
                )
              }

              description="Moments where information was challenged or verified."

            />



            <MetricCard

              icon={
  <Pencil
    size={18}
    strokeWidth={1.8}
  />
}

              title="Edit Ratio"

              value={
                Math.round(
                  assessment.signals.editRatio * 100
                ) + "%"
              }

              description="How much your draft evolved through revisions."

            />


          </div>


        </section>








        {/* Scores */}

        <section
          className="
            grid
            gap-5
            md:grid-cols-2
          "
        >


          <MetricCard

            icon={
  <Bot
    size={18}
    strokeWidth={1.8}
  />
}

            title="AI Collaboration Score"

            value={
              String(
                assessment.scores.collaborationScore
              )
            }

            description="Based on interaction quality and verification behaviour."

          />



          <MetricCard

            icon={
  <RefreshCw
    size={18}
    strokeWidth={1.8}
  />
}

            title="Iteration Score"

            value={
              String(
                assessment.scores.iterationScore
              )
            }

            description="Based on how your writing improved over iterations."

          />


        </section>








        {/* AI Evaluation */}

        <section
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white
            p-8
            shadow-sm
          "
        >


          <h2
            className="
              text-xl
              font-semibold
            "
          >
            AI Evaluation
          </h2>




          <div
            className="
              mt-5
              rounded-2xl
              bg-zinc-50
              p-5
            "
          >

            <p
              className="
                text-sm
                font-medium
                text-zinc-500
              "
            >
              Summary
            </p>


            <p
              className="
                mt-2
                leading-7
                text-zinc-700
              "
            >

              {
                assessment.feedback?.summary ??
                "Evaluation unavailable."
              }

            </p>


          </div>






          <div
            className="
              mt-6
              grid
              gap-5
              md:grid-cols-2
            "
          >


            <FeedbackCard

              title="Strengths"

              icon="✓"

              type="strength"

              items={
                assessment.feedback?.strengths ?? []
              }

            />



            <FeedbackCard

              title="Suggestions"

              icon="→"

              type="improvement"

              items={
                assessment.feedback?.improvements ?? []
              }

            />


          </div>



        </section>








        {/* Methodology */}

        <section
          className="
            rounded-3xl
            border
            border-zinc-200
            bg-white
            p-6
          "
        >

          <h2
            className="
              font-semibold
            "
          >
            How this score is calculated
          </h2>


          <p
            className="
              mt-3
              text-sm
              leading-6
              text-zinc-600
            "
          >

            Scores are generated using measurable collaboration signals:
            AI interaction frequency, verification behaviour, and how your
            writing evolved through revisions.

          </p>


        </section>






        <div
          className="
            flex
            justify-end
            pt-4
          "
        >


          <button

            onClick={
              startNewAssessment
            }

            className="
              rounded-xl
              bg-black
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-zinc-800
            "

          >

            Start New Assessment

          </button>


        </div>




      </div>


    </main>

  );

}