import {React, useRef, useEffect} from 'react'
import Message from './Message'


function ChatBox({messages, user}) {
  const endOfMessagesRef = useRef(null);

  console.log(messages)
    
  let message = messages.map((message)=><Message key={message.id} message={message} user={user}/>)

  return (
    <div className="chat-box max-h-[500px] bg-[#1a1a1a] rounded-xl overflow-y-auto">
      {message.reverse()}
    </div>
  )
}

export default ChatBox