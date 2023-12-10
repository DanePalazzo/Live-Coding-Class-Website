import React from 'react'
import Message from './Message'


function ChatBox({messages, user}) {
    
  // let message = messages.toReversed().map((message)=><Message key={messages.indexOf(message)} message={message} user={user} />)

  return (
    <div className="chat-box">
        {messages.toReversed().map((message)=>{
            return <Message 
                key={messages.indexOf(message)} 
                message={message}
                user={user}
            />
        })}
    </div>
  )
}

export default ChatBox