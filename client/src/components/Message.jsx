import React from 'react'

function Message({message, user}) {

  return (
    <div>
        <p>{message.user.name}:</p>
        <p>{message.message_text}</p>
    </div>
  )
}

export default Message