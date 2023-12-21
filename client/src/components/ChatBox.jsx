import {React, useRef, useEffect} from 'react'
import Message from './Message'


function ChatBox({socket, messages, user, sessionId}) {
  const endOfMessagesRef = useRef(null);

  // console.log(messages)
    
  let message = messages.map((message)=><Message key={message.id} socket={socket} message={message} user={user} sessionId={sessionId}/>)

  return (
    <div className="chat-box max-h-[500px] bg-[#1a1a1a] rounded-xl overflow-y-auto">
      {message.reverse()}
    </div>
  )
}

export default ChatBox