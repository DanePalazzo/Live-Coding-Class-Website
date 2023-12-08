import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function ChatBrowser({user}) {
    const navigate = useNavigate();

    const goToRoom = () => {
        navigate('/chatroom');
    };

  return (
    <div><h1></h1>ChatBrowser
        <h3 onClick={goToRoom}>Chat Room</h3>
    </div>
  )
}

export default ChatBrowser