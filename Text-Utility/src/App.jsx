import React, { useState } from "react";
import './App.css'
import NavBar from "./Components/Navbar";
import TextArea from "./Components/TextArea";
import Accordion from "./Components/About";

function App(){
  const [mode,setMode]=useState('light')

  const ToggleMode=()=>{
    if(mode==='light'){
      setMode('dark')
      document.body.style.backgroundColor='grey'
    }
    else{
      setMode('light')
      document.body.style.backgroundColor='white'
    }
  }

  return(
    <>
    <NavBar title="Text-Utils" mode={mode} ToggleMode={ToggleMode} />
    <TextArea Label="Enter the Text to be Analyzed" mode={mode}/>
    </>
  )
}
export default App;