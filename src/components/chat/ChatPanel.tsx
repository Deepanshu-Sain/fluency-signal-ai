"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function ChatPanel() {

  const [input, setInput] =
    useState("");


  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);


  const textareaRef =
    useRef<HTMLTextAreaElement | null>(null);



  const {
    messages,
    sendMessage,
    status,
  } = useChat({

    transport:
      new DefaultChatTransport({

        api: "/api/chat",

        body: {

          sessionId:
            typeof window !== "undefined"
              ? localStorage.getItem(
                  "fluency-session-id"
                )
              : null,

        },

      }),

  });





  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({

      behavior:"smooth",

    });

  },[messages]);






  function resizeTextarea(){

    const textarea =
      textareaRef.current;


    if(!textarea)
      return;


    textarea.style.height =
      "auto";


    textarea.style.height =
      `${Math.min(
        textarea.scrollHeight,
        180
      )}px`;

  }






  function handleInputChange(
    value:string
  ){

    setInput(value);


    requestAnimationFrame(
      resizeTextarea
    );

  }







  async function handleSubmit(
    event:React.FormEvent
  ){

    event.preventDefault();


    if(!input.trim())
      return;



    await sendMessage({

      text:input,

    });


    setInput("");


    requestAnimationFrame(
      resizeTextarea
    );

  }







  function handleKeyDown(
    event:React.KeyboardEvent<HTMLTextAreaElement>
  ){

    if(
      event.key==="Enter" &&
      !event.shiftKey
    ){

      event.preventDefault();


      handleSubmit(event);

    }

  }







return (

<section
  className="
    saas-card
    flex
    h-[680px]
    flex-col
    overflow-hidden
    fade-in
  "
>



{/* Header */}

<div
className="
border-b
border-zinc-100
bg-white
px-6
py-5
"
>


<div
className="
flex
items-center
justify-between
"
>


<div>

<div
className="
flex
items-center
gap-2
"
>

<h2
className="
text-lg
font-semibold
tracking-tight
"
>
AI Writing Assistant
</h2>


<span
className="
h-2
w-2
rounded-full
bg-green-500
"
/>


</div>


<p
className="
mt-1
text-sm
text-zinc-500
"
>
Collaborate, refine, and challenge ideas.
</p>


</div>





<span
className="
rounded-full
bg-zinc-100
px-3
py-1
text-xs
font-medium
text-zinc-600
"
>
AI Assistant
</span>


</div>


</div>








{/* Messages */}

<div
className="
flex-1
space-y-5
overflow-y-auto
bg-zinc-50/70
px-5
py-5
"
>





{
messages.length===0 && (

<div
className="
rounded-2xl
border
border-zinc-200
bg-white
p-6
shadow-sm
"
>


<h3
className="
font-medium
text-zinc-900
"
>
Start collaborating with AI
</h3>


<p
className="
mt-2
text-sm
text-zinc-500
"
>
Use the assistant to improve your outreach strategy.
</p>



<ul
className="
mt-4
space-y-2
text-sm
text-zinc-600
"
>

<li>
→ Improve email personalization
</li>

<li>
→ Challenge my messaging
</li>

<li>
→ Suggest stronger openings
</li>


</ul>


</div>

)

}








{
messages.map(
(message)=>(

<div
key={message.id}
className={`
fade-in
max-w-[85%]
rounded-2xl
px-4
py-3
text-sm
leading-6
${
message.role==="user"
?
"ml-10 bg-zinc-900 text-white [&_*]:text-white"
:
"mr-auto border border-zinc-200 bg-white text-zinc-800 shadow-sm"
}
`}
>


{
message.parts.map(
(part,index)=>

part.type==="text"

?

<div
key={index}
className="
prose
prose-sm
max-w-none
prose-p:my-2
prose-li:my-1
"
>

<ReactMarkdown
remarkPlugins={[
remarkGfm
]}
>

{part.text}

</ReactMarkdown>


</div>

:

null

)

}



</div>


)

)

}








{
status==="submitted" && (

<div
className="
mr-auto
rounded-2xl
border
border-zinc-200
bg-white
px-4
py-3
text-sm
text-zinc-500
shadow-sm
"
>

<div
className="
flex
items-center
gap-2
"
>

<span>
AI is thinking
</span>


<span
className="
animate-pulse
"
>
•••
</span>


</div>


</div>


)

}




<div
ref={messagesEndRef}
/>


</div>








{/* Composer */}


<form
onSubmit={handleSubmit}
className="
border-t
border-zinc-100
bg-white
p-4
"
>


<div
className="
flex
items-end
gap-3
rounded-2xl
border
border-zinc-200
bg-zinc-50
p-2
"
>


<textarea

ref={textareaRef}

value={input}

onChange={(event)=>
handleInputChange(
event.target.value
)
}

onKeyDown={handleKeyDown}

rows={1}

placeholder="Ask the assistant..."

className="
max-h-44
min-h-11
flex-1
resize-none
bg-transparent
px-3
py-2
text-sm
outline-none
"
/>




<button

type="submit"

disabled={
status==="submitted"
}

className="
rounded-xl
bg-black
px-5
py-2.5
text-sm
font-medium
text-white
transition
hover:bg-zinc-800
disabled:opacity-50
"

>

Send

</button>



</div>


<p
className="
mt-2
text-center
text-xs
text-zinc-400
"
>
Enter to send · Shift + Enter for new line
</p>


</form>



</section>

);


}