import {React, useState, useEffect, useRef} from 'react'
import ChatBox from './ChatBox'

function Chat({ messages, user, socket, connected, sessionId, setMessages }) {
    const [newMessage, setNewMessage] = useState("")
    
    // console.log(messages)

    //Set Ref for socket state
    const messagesRef = useRef(messages)
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    //Return of single new message from server
    useEffect(() => {
        if (connected) {
            socket.on('new_message', (serverMessage) => {
                const currentMessages = messagesRef.current;
                console.log("new_message:")
                console.log(currentMessages)
                console.log(serverMessage)
                let updatedMessages = [...currentMessages]
                updatedMessages = [...updatedMessages, serverMessage]
                // console.log(updatedMessages)
                setMessages(updatedMessages)
            })
            socket.on('message_deleted', (serverMessage) => {
                const currentMessages = messagesRef.current;
                console.log(`message_deleted: ${serverMessage}`)
                let updatedMessages = [...currentMessages]
                updatedMessages = updatedMessages.filter((message) => message.id !== serverMessage)
                console.log(updatedMessages)
                setMessages(updatedMessages)
            })
            socket.on('message_edited', (serverMessage) => {
                const currentMessages = messagesRef.current;
                console.log(`message_edited: ${serverMessage}`);
                const updatedMessages = currentMessages.map(message => {
                    if (message.id === serverMessage.id) {
                        return { ...message, message_text: serverMessage.message_text, edited: true };
                    }
                    return message;
                });
                setMessages(updatedMessages);
            });
        }
        return () => {
            if (socket) {
                socket.removeListener('new_message', (msg) => {console.log(msg); });
                socket.removeListener('message_deleted', (msg) => {console.log(msg); });
                socket.removeListener('message_edited', (msg) => {console.log(msg); });
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
                <input onChange={(e) => setNewMessage(e.target.value)} defaultValue="Message" value={newMessage} className='flex flex-grow bg-[#2a2a2a] rounded-xl p-2 text-gray-400'/>
                <button type="submit" className="btn btn-ghost">SEND</button>
            </form>
            <ChatBox messages={messages} user={user} socket={socket} sessionId={sessionId} />
        </div>
    )
}

export default Chat
