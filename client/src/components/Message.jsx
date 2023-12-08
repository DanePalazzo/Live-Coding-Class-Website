import React from 'react'

function Message({message, user}) {
  return (
    <div className='message'>
        <p className={message.sender == user ? "my-message" : "their-message"}>{message.sender}: {" "}</p>
        <p>{message.message}</p>
    </div>
  )
}

export default Message