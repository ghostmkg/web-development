import React, { useEffect } from 'react'
import Home from './pages/Home/Home.jsx'
import Login from './pages/Login/Login.jsx'
import { Route,Routes, useNavigate } from 'react-router-dom'
import Player from './pages/Player/Player.jsx'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase.js'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Search from './pages/Search/Search.jsx'

const App = () => {

  const nav = useNavigate();

  useEffect(()=>{
    onAuthStateChanged(auth,async(user)=>{
      if(user){
        console.log("Logged In");
        nav("/");
      }else{
        console.log("logged out");
        nav("/login");
      }
    });
  },[])

  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/player/:id' element={<Player />} />
        <Route path='/search' element={<Search />} />
      </Routes>
    </div>
  )
}

export default App
