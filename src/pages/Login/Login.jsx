import React from 'react'
import './Login.css'
import Logo from "../../assets/logo.png"
import { useState } from 'react'
import {login ,signUp} from "../../firebase.js"
import netflix_spinner from "../../assets/netflix_spinner.gif"

const Login = () => {
  const [status, setStatus] = useState("Sign In");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user_auth = async (event) => {
    event.preventDefault();
    setLoading(true);
    if(status==="Sign In"){
      await login(email, password);
    }else{
      await signUp(name, email, password);
    }
    setLoading(false);
  }

  return (
    loading?<div className="login-spinner">
      <img src={netflix_spinner} alt = ""></img>
    </div>:
    <div className='login'>
      <img src={Logo} className='logo-image' />
      <div className="login-form">
        <h1>{status}</h1>
        <form action="">
          {status==="Sign Up" ? 
          <input type='text' value={name} onChange={(e)=>{setName(e.target.value)}} placeholder='Your Name' />:<></>}
          <input type='email' value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Your Email' />
          <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password' />
          <button onClick={user_auth} type='submit'>{status}</button>
          <div className="form-help">
            <div className="remember">
              <input type='checkbox' />
              <label htmlFor=''>Remember Me</label>
            </div>   
            <p>Need Help?</p>       
        </div>
        </form>
        <div className="form-switch">
          {status==="Sign Up"?<p>Already have account? <span onClick={()=>{setStatus("Sign In")}}>Sign In Now</span></p>:<p>New to Netflix <span onClick={()=>{setStatus("Sign Up")}}>Sign Up Now</span></p>}
        </div>
      </div>
    </div>
  )
}

export default Login
