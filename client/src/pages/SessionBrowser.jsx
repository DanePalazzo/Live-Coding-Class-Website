import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function SessionBrowser({user}) {
    const navigate = useNavigate();

    const goToRoom = () => {
        navigate('/sessionroom');
    };

  return (
    <div><h1></h1>ChatBrowser
        <h3 onClick={goToRoom}>Chat Room</h3>
    </div>
  )
}

export default SessionBrowser