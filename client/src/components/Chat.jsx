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
        }
        return () => {
            if (socket) {
                socket.removeListener('new_message', (msg) => {console.log(msg); });
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
        <div>
            <ChatBox messages={messages} user={user} socket={socket} sessionId={sessionId} />
            <form onSubmit={e => handleSendMessage(e)}>
                <label>Message:</label>
                <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
                <button type="submit">SEND</button>
            </form>

        </div>
    )
}

export default Chat
