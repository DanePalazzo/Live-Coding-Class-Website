import { React, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import ChatBox from '../components/ChatBox'
import { useNavigate } from 'react-router-dom';
import Document from '../components/Document';
import Editor from '@monaco-editor/react'

let socket

function SessionRoom({ user, sessionId, setSessionId }) {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("script.py")
    const [connected, setConnected] = useState(false)

    // monaco testing state
    const [fileName, setFileName] = useState("script.py")
    const editorRef = useRef(null)

    function handleEditorDidMount(editor, monaco){
        editorRef.current = editor
    }

    function getEditorValue(){
        console.log(editorRef.current.getValue())
    }

    //Checks if we have a user or session before running the page
    const navigate = useNavigate()
    if(!user){
        navigate('/login')
    }
    if(!sessionId){
        navigate('/sessionsbrowser')
    }
    // console.log(sessionId)

    //monaco testing object
    const files = {
        "script.py": {
            name: "script.py",
            language: "python",
            value: "scripty.py content here"
        },
        "index.html": {
            name: "index.html",
            language: "html",
            value: "<div>index.html content here<div/>"
        }
    }
    const file = files[fileName]

    //socket connect
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

    //Handels the message emit to the socket
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
            <div className='code_editor'>
                <Editor 
                    onChange={getEditorValue}
                    height="100%"
                    width="100%"
                    theme='vs-dark'
                    onMount={handleEditorDidMount}
                    path={file.name}
                    defaultLanguage={file.language}
                    defaultValue={file.value}
                />
            </div>
            <div>
                <Document user={user} socket={socket}/>
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