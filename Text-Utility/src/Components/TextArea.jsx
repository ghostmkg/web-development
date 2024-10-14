import React from 'react'
import { useState } from 'react'

function TextArea(props) {
    const [text,settext] = useState("enter text here ")
    
    const handleOnChange=(event)=>{
        console.log("Event Occured")
        settext(event.target.value)
        
    }
    const HandleClearance=()=>{
        settext("");

    }

    const HandleUpperClick=()=>{
        console.log("Button was clicked")
        settext(text.toUpperCase())
    }
    const HandleLowerClick=()=>{
        console.log("Button was clicked")
        settext(text.toLowerCase())
    }

  return (
    <>
    <div style={{margin:'20px', color: props.mode==='dark'?'white':'black'}} className="mb-3">
    <h1>{props.Label}</h1>
    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" value={text} style={{ color: props.mode==='dark'?'white':'black' , backgroundColor: props.mode==='dark'?'grey':'white'}} onChange={handleOnChange}>    
    </textarea>
    </div>
    <button style={{margin:'20px'}} onClick={HandleUpperClick}  className="btn btn-primary">Convert To UpperCase</button>
    <button style={{margin:'20px'}} onClick={HandleLowerClick}  className="btn btn-primary">Convert To LowerCase</button>
    <button style={{margin:'20px'}} onClick={HandleClearance}  className="btn btn-primary">Clear</button>
    <div className="container" style={{color: props.mode==='dark'?'white':'black'}} >
        <h1>Analyzed Text</h1>
        <p> {text.split(" ").length} words and {text.length} characters</p>
        <p>Reading Time : {((text.split(" ").length - 1 )*0.0042)} Minutes</p>
    </div>
    </>
  )
}

export default TextArea