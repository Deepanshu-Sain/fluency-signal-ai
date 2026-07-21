"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ChatPanel from "@/components/chat/ChatPanel";
import EmailEditor from "@/components/editor/EmailEditor";
import { useDraftTracking } from "@/hooks/useDraftTracking";

export default function Home() {
  const [emailDraft, setEmailDraft] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const router = useRouter();

  useDraftTracking(emailDraft);


  useEffect(() => {

    async function createSession() {

      const existingSessionId =
        localStorage.getItem(
          "fluency-session-id"
        );


      const completed =
        localStorage.getItem(
          "fluency-session-completed"
        );


      if(
        existingSessionId &&
        !completed
      ){

        setSessionId(
          existingSessionId
        );

        return;

      }


      const response =
        await fetch(
          "/api/session",
          {
            method:"POST",
          }
        );


      const data =
        await response.json();



      localStorage.setItem(
        "fluency-session-id",
        data.id
      );


      localStorage.removeItem(
        "fluency-session-completed"
      );


      setSessionId(
        data.id
      );

    }


    createSession();

  }, []);





  function submitSession(){

    localStorage.setItem(
      "fluency-session-completed",
      "true"
    );


    router.push(
      "/report"
    );

  }





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
          max-w-6xl
          space-y-10
        "
      >



        {/* Hero */}

        <header
          className="
            space-y-4
          "
        >

          <span
            className="
              inline-flex
              rounded-full
              bg-zinc-100
              px-3
              py-1
              text-xs
              font-medium
              text-zinc-600
            "
          >
            AI Collaboration Assessment
          </span>



          <h1
            className="
              text-4xl
              font-semibold
              tracking-tight
            "
          >
            The Fluency Signal
          </h1>



          <p
            className="
              max-w-2xl
              text-base
              leading-7
              text-zinc-600
            "
          >
            Measure how effectively you collaborate with AI while solving a
            real-world writing task.
          </p>



        </header>






        {/* Task Card */}

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
            Outreach Task
          </h2>



          <div
            className="
              mt-6
              grid
              gap-6
              md:grid-cols-3
            "
          >


            <div>

              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                Prospect
              </p>


              <p
                className="
                  mt-2
                  font-medium
                "
              >
                Aarav Mehta
              </p>


              <p
                className="
                  text-sm
                  text-zinc-600
                "
              >
                Head of Operations · Razorpay
              </p>

            </div>





            <div>

              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                Objective
              </p>


              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-zinc-700
                "
              >
                Introduce Notion AI as a solution for improving documentation,
                knowledge sharing, and collaboration.
              </p>

            </div>





            <div>

              <p
                className="
                  text-sm
                  text-zinc-500
                "
              >
                Recommended Workflow
              </p>


              <ul
                className="
                  mt-2
                  space-y-2
                  text-sm
                  text-zinc-700
                "
              >

                <li>
                  ✓ Brainstorm ideas
                </li>

                <li>
                  ✓ Refine messaging
                </li>

                <li>
                  ✓ Challenge assumptions
                </li>

                <li>
                  ✓ Finalize draft
                </li>


              </ul>

            </div>


          </div>


        </section>








        {/* Workspace */}

        <section
          className="
            space-y-4
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-semibold
              "
            >
              Writing Workspace
            </h2>


            <p
              className="
                mt-1
                text-sm
                text-zinc-500
              "
            >
              Collaborate with AI and craft your final outreach email.
            </p>

          </div>





          <section
            className="
              grid
              gap-6
              lg:grid-cols-2
            "
          >

            <ChatPanel />


            <EmailEditor

              value={
                emailDraft
              }

              onChange={
                setEmailDraft
              }

            />

          </section>


        </section>








        {/* Submit */}

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
              text-zinc-500
            "
          >
            Review your draft before submitting your assessment.
          </p>



          <button

            onClick={
              submitSession
            }

            className="
              rounded-xl
              bg-black
              px-7
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-zinc-800
            "

          >

            Submit Assessment →

          </button>


        </div>




      </div>


    </main>

  );

}