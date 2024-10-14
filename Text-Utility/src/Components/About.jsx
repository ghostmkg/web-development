import React from 'react'
import { useState } from 'react'

export default function Accordion(props) {

    const [ MyStyle , SetMyStyle ] = useState ({
        color:'black',
        backgroundColor:'white'
    })
    
    const [ModeText,setModeText]=useState("Enable Dark Mode")

    const EnableDarkMode=()=>{
        
        if(MyStyle.color==="black"){
            SetMyStyle({
                color:'white',
                backgroundColor:'grey',
            });

            setModeText("Disable Dark Mode");
        }
        else{
            SetMyStyle({
                color:'black',
                backgroundColor:'white',
            });

            setModeText("Enable Dark Mode");
        }
    }

    return (
    <>
    <h2>{props.heading}</h2>
        <div className="accordion" style={MyStyle} id="accordionExample">
        <div className="accordion-item" style={MyStyle} >
            <h2 className="accordion-header">
            <button style={MyStyle} className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Accordion Item #1
            </button>
            </h2>
            <div id="collapseOne" style={MyStyle} className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div className="accordion-body">
                <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </div>
            </div>
        </div>
        <div style={MyStyle} className="accordion-item">
            <h2 className="accordion-header">
            <button style={MyStyle} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Accordion Item #2
            </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </div>
            </div>
        </div>
        <div style={MyStyle} className="accordion-item">
            <h2 className="accordion-header">
            <button style={MyStyle} className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                Accordion Item #3
            </button>
            </h2>
            <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
                <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classNamees that we use to style each element. These classNamees control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
            </div>
            </div>
        </div>
        </div>
        <div className="container my-3 " >
            <button onClick={EnableDarkMode} className="btn btn-secondary" >{ModeText}</button>
        </div>
    </>
  )
}
