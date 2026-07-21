import { useEffect, useRef, useState } from "react";
import { diffWords } from "diff";
import { EmailSnapshot } from "@/types/session";


function extractTextFromHTML(html: string) {

  const div = document.createElement("div");

  div.innerHTML = html;

  return div.innerText
    .replace(/\s+/g, " ")
    .trim();

}



export function useDraftTracking(
  draft: string
) {


  const [snapshots, setSnapshots] =
    useState<EmailSnapshot[]>([]);



  const lastSavedDraft =
    useRef("");



  const lastVersionId =
    useRef<string | null>(null);



  async function saveSnapshot(
    content: string,
    changedWords: number,
    isEdit: boolean,
    charactersChanged: number
  ) {


    const sessionId =
      localStorage.getItem(
        "fluency-session-id"
      );


    if (!sessionId)
      return;



    const response =
      await fetch(
        "/api/email/version",
        {
          method: "POST",

          headers:{
            "Content-Type":
              "application/json",
          },

          body:JSON.stringify({
            sessionId,
            content,
            changedWords,
          }),

        }
      );



    const version =
      await response.json();





    if(
      isEdit &&
      lastVersionId.current
    ){


      const previousText =
        extractTextFromHTML(
          lastSavedDraft.current
        );



      const currentText =
        extractTextFromHTML(
          content
        );



      const baselineLength =
        previousText.length;



      const editRatioContribution =
        baselineLength > 0
        ?
        Math.min(
          1,
          Number(
            (
              charactersChanged /
              baselineLength
            ).toFixed(3)
          )
        )
        :
        0;





      await fetch(
        "/api/email/event",
        {
          method:"POST",

          headers:{
            "Content-Type":
              "application/json",
          },


          body:JSON.stringify({

            sessionId,


            previousVersionId:
              lastVersionId.current,


            newVersionId:
              version.id,


            charactersChanged,


            editRatioContribution,


            meaningful:
              charactersChanged >= 50 &&
              editRatioContribution >= 0.05,

          }),
        }
      );

    }




    lastVersionId.current =
      version.id;


    lastSavedDraft.current =
      content;


  }







  useEffect(()=>{


    const currentText =
      extractTextFromHTML(
        draft
      );



    if(!currentText)
      return;



    const timer =
      setTimeout(()=>{


        const previousText =
          extractTextFromHTML(
            lastSavedDraft.current
          );




        /*
          First ever draft.

          Important:
          This is NOT an edit.

          It is the baseline.
        */


        if(!previousText){


          const wordCount =
            currentText
              .split(/\s+/)
              .filter(Boolean)
              .length;



          const snapshot = {

            id:
              crypto.randomUUID(),

            content:draft,

            createdAt:
              new Date(),

            changedWords:
              wordCount,

          };



          setSnapshots(prev=>[
            ...prev,
            snapshot
          ]);



          saveSnapshot(
            draft,
            wordCount,
            false,
            0
          );



          return;

        }






        const changes =
          diffWords(
            previousText,
            currentText
          );




        const changedText =
          changes
            .filter(
              part =>
                part.added ||
                part.removed
            )
            .map(
              part =>
                part.value
            )
            .join("");




        const charactersChanged =
          changedText.length;




        const changedWords =
          changedText
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;





        // Ignore cursor movement,
        // formatting-only changes,
        // tiny edits

        if(
          charactersChanged < 20
        ){

          return;

        }





        const snapshot = {

          id:
            crypto.randomUUID(),

          content:draft,

          createdAt:
            new Date(),

          changedWords,

        };



        setSnapshots(prev=>[
          ...prev,
          snapshot
        ]);



        saveSnapshot(
          draft,
          changedWords,
          true,
          charactersChanged
        );



      },3000);




    return () =>
      clearTimeout(timer);



  },[draft]);

  return {
    snapshots,
  };

}