import React from 'react'
import { useNavigate } from 'react-router-dom';

function NotFound() {

  const navigate = useNavigate();

  return (
    <div>
        <h2>Page Not Found</h2>
        <button onClick={() => navigate("/")}>Return Home</button>
    </div>
  )
}

export default NotFound