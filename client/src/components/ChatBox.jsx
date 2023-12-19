import React from 'react'
import Message from './Message'


function ChatBox({messages, user}) {

  // console.log(messages)
    
  let message = messages.map((message)=><Message key={messages.id} message={message} user={user} />)

  return (
    <div className="chat-box">
      {message}
    </div>
  )
}

export default ChatBox