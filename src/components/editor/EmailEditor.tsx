"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";


interface EmailEditorProps {
  value: string;
  onChange: (value: string) => void;
}


export default function EmailEditor({
  value,
  onChange,
}: EmailEditorProps) {


  const editorRef =
    useRef<HTMLDivElement | null>(null);


  const savedSelection =
    useRef<Range | null>(null);


  const [activeFormats,setActiveFormats] =
    useState({
      bold:false,
      italic:false,
      list:false,
    });





  useEffect(()=>{

    if(
      editorRef.current &&
      editorRef.current.innerHTML !== value
    ){

      editorRef.current.innerHTML =
        value || "";

    }

  },[value]);





  function saveSelection(){

    const selection =
      window.getSelection();


    if(
      selection &&
      selection.rangeCount > 0
    ){

      savedSelection.current =
        selection.getRangeAt(0);

    }

  }





  function restoreSelection(){

    const selection =
      window.getSelection();


    if(
      selection &&
      savedSelection.current
    ){

      selection.removeAllRanges();

      selection.addRange(
        savedSelection.current
      );

    }

  }





  function updateContent(){

    const html =
      editorRef.current?.innerHTML ?? "";


    onChange(html);

  }





  function updateToolbarState(){

    setActiveFormats({

      bold:
        document.queryCommandState("bold"),

      italic:
        document.queryCommandState("italic"),

      list:
        document.queryCommandState(
          "insertUnorderedList"
        ),

    });

  }





  function executeCommand(
    command:string
  ){

    const editor =
      editorRef.current;


    if(!editor)
      return;


    editor.focus();

    restoreSelection();


    document.execCommand(
      command,
      false
    );


    saveSelection();

    updateContent();

    updateToolbarState();

  }





  function addBulletList(){

    const editor =
      editorRef.current;


    if(!editor)
      return;


    editor.focus();

    restoreSelection();


    document.execCommand(
      "insertUnorderedList",
      false
    );


    saveSelection();

    updateContent();

    updateToolbarState();

  }





  function handleInput(){

    updateContent();

    saveSelection();

    updateToolbarState();

  }





  function handleKeyDown(
    event:React.KeyboardEvent<HTMLDivElement>
  ){

    if(
      (event.ctrlKey ||
      event.metaKey) &&
      event.key.toLowerCase()==="b"
    ){

      event.preventDefault();

      executeCommand("bold");

    }



    if(
      (event.ctrlKey ||
      event.metaKey) &&
      event.key.toLowerCase()==="i"
    ){

      event.preventDefault();

      executeCommand("italic");

    }

  }





  const wordCount =
    value
      .replace(/<[^>]+>/g," ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .length;






return (

<section
className="
rounded-3xl
border
border-zinc-200
bg-white
p-6
shadow-sm
h-[680px]
flex
flex-col
"
>





{/* Header */}

<div
className="
mb-5
"
>


<h2
className="
text-xl
font-semibold
tracking-tight
"
>
New Message
</h2>


<div
className="
mt-3
space-y-2
text-sm
"
>


<div
className="
flex
gap-2
text-zinc-600
"
>

<span
className="font-medium"
>
To:
</span>

<span>
Aarav Mehta
</span>

</div>



<div
className="
flex
gap-2
text-zinc-600
"
>

<span
className="font-medium"
>
Subject:
</span>

<span>
Introducing Notion AI for better knowledge workflows
</span>

</div>


</div>


</div>







{/* Toolbar */}

<div
className="
mb-4
flex
gap-2
rounded-xl
border
border-zinc-200
bg-zinc-50
p-2
"
>


{
[
{
label:"B",
command:"bold",
active:activeFormats.bold
},
{
label:"I",
command:"italic",
active:activeFormats.italic
}
].map(
(item)=>(
<button

key={item.command}

type="button"

onMouseDown={(e)=>{
e.preventDefault();
saveSelection();
}}

onClick={()=>
executeCommand(
item.command
)
}

className={`
rounded-lg
px-3
py-1.5
text-sm
transition
${
item.active
?
"bg-black text-white"
:
"hover:bg-white"
}
`}
>

{item.label}

</button>
)

)

}





<button

type="button"

onMouseDown={(e)=>{
e.preventDefault();
saveSelection();
}}

onClick={addBulletList}

className={`
rounded-lg
px-3
py-1.5
text-sm
transition
${
activeFormats.list
?
"bg-black text-white"
:
"hover:bg-white"
}
`}
>

List

</button>



</div>








{/* Editor */}

<div
className="
relative
flex-1
overflow-y-auto
rounded-2xl
border
border-zinc-200
px-5
py-4
"
>


{
!value && (

<div
className="
pointer-events-none
absolute
left-5
top-4
text-sm
leading-6
text-zinc-400
"
>

Write your outreach email here...
<br/>

<span
className="
text-xs
"
>
Use AI Assistant to brainstorm, refine tone, or personalize.
</span>


</div>

)

}




<div

ref={editorRef}

contentEditable

suppressContentEditableWarning

onInput={handleInput}

onKeyDown={handleKeyDown}

onMouseUp={()=>{
saveSelection();
updateToolbarState();
}}

onKeyUp={()=>{
saveSelection();
updateToolbarState();
}}

className="
relative
min-h-full
outline-none
text-[15px]
leading-6
text-zinc-800
prose
prose-zinc
prose-ul:list-disc
prose-li:ml-5
max-w-none
"

/>


</div>







<div
className="
mt-4
flex
justify-end
"
>

<span
className="
rounded-full
bg-zinc-100
px-3
py-1
text-xs
text-zinc-500
"
>

{wordCount} words

</span>


</div>




</section>


);


}