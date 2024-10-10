import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform your logout logic here
    // Then navigate to the login page or home page

    navigate('/');
  };

  return (
   <div><button onClick={handleLogout}>Logout</button>
    <p> Comfirm Logout</p></div> 
  );
};

export default Logout;
