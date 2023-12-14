import { React, useState, useEffect } from 'react'
import { io } from 'socket.io-client';
import ChatBox from '../components/ChatBox'
import { useNavigate } from 'react-router-dom';

let socket

function SessionRoom({ user, sessionId, setSessionId }) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [connected, setConnected] = useState(false)
    const navigate = useNavigate()
    if(!user){
        navigate('/login')
    }
    if(!sessionId){
        navigate('/sessionsbrowser')
    }
    // console.log(sessionId)

    useEffect(() => {
        socket = io('ws://localhost:5555');
        setConnected(true)
        return () => {
            socket.off('disconnected', (msg) => {console.log(msg);});
        }
    }, []);


    function handleMessagesRequest(){
        console.log("handleMessagesRequest called")
        socket.emit('messages_request', sessionId)
    }

    //ON FIRST CONNECT
    useEffect(() => {
        if (connected) {
            socket.emit('join_session', sessionId)
            socket.on('messages_fetched', (serverMessage) => {
                console.log("messages_fetched:")
                setMessages(serverMessage)
                console.log(serverMessage)
            })
            handleMessagesRequest()
        }
        return () => {
            socket.removeListener('messages_fetched', (msg) => { console.log(msg);});
        }
    }, [connected]);

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
            socket.removeListener('new_message', (msg) => {console.log(msg); });
        }
    }, [messages, connected]);

    function handleSendMessage(e, user_id = user.id, session_id = sessionId, message_txt = newMessage) {
        e.preventDefault()
        console.log(`Sent Message: ${message_txt}`)
        socket.emit('user_message', user_id, session_id, message_txt)
        setNewMessage("")
    }

    return (
        <>
            <div>
                <h1>Session</h1>
            </div>
            <div>
                <ChatBox messages={messages} user={user} socket={socket} />
                <form onSubmit={e => handleSendMessage(e)}>
                    <label>Message:</label>
                    <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
                </form>
            </div>
        </>


    )
}

export default SessionRoom