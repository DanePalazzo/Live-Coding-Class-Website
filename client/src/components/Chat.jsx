import {React, useState, useEffect} from 'react'
import ChatBox from './ChatBox'

function Chat({ messages, user, socket, connected, sessionId, setMessages }) {
    const [newMessage, setNewMessage] = useState("")
    
    

    //Return of single new message from server
    useEffect(() => {
        if (connected) {
            socket.on('new_message', (serverMessage) => {
                console.log("new_message:")
                console.log(messages)
                console.log(serverMessage)
                let updatedMessages = [...messages]
                updatedMessages = [...updatedMessages, serverMessage]
                // console.log(updatedMessages)
                setMessages(updatedMessages)
            })
            socket.on('message_deleted', (serverMessage) => {
                let updatedMessages = [...messages]
                updatedMessages = updatedMessages.filter((message) => message.id !== serverMessage.id)
                setMessages(updatedMessages)
            })
        }
        return () => {
            if (socket) {
                socket.removeListener('new_message', (msg) => {console.log(msg); });
                socket.removeListener('message_deleted', (msg) => {console.log(msg); });
            }
        }
    }, [messages, connected]);

    //Handels the message emit to the socket
    function handleSendMessage(e, user_id = user.id, session_id = sessionId, message_txt = newMessage) {
        e.preventDefault()
        console.log(`Sent Message: ${message_txt}`)
        socket.emit('user_message', user_id, session_id, message_txt)
        setNewMessage("")
    }

    return (
        <div className="flex flex-col justify-center bg-[#111111] p-3 rounded-xl">
            <form onSubmit={e => handleSendMessage(e)} className="flex flex-col justify-center p-1 rounded-xl">
                <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} className='flex flex-grow bg-[#2a2a2a] rounded-xl p-2 text-gray-400'/>
                <button type="submit" className="btn btn-ghost">SEND</button>
            </form>
            <ChatBox messages={messages} user={user} socket={socket} sessionId={sessionId} />
        </div>
    )
}

export default Chat
