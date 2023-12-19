import { React, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import ChatBox from '../components/ChatBox'
import Document from '../components/Document';
import CodeEditor from '../components/CodeEditor'
import ProjectSelector from '../components/ProjectSelector'
import Editor from '@monaco-editor/react'


let socket

function SessionRoom({ user, sessionId, setSessionId }) {
    //Checks if we have a user or session before running the page
    const navigate = useNavigate()
    useEffect(() => {
        if(!user){
            navigate('/login')
        }
        if(!sessionId){
            navigate('/sessionsbrowser')
        }
    }, []);

    //States
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("script.py")
    const [connected, setConnected] = useState(false)
    const [userProjects, setUserProjects] = useState([])
    const [sessionProjects, setSessionProjects] = useState([])
    const [activeProjects, setActiveProjects] = useState([])
    const [codeValue1, setCodeValue1] = useState("Initial content for editor 1");
    const [codeValue2, setCodeValue2] = useState("Initial content for editor 2");

    console.log(userProjects)

    //socket connect
    useEffect(() => {
        if(user && user.projects){
            socket = io('ws://localhost:5555');
            setConnected(true)
            setUserProjects(user.projects)
        }
        return () => {
            if (socket) {
            socket.off('disconnected', (msg) => {console.log(msg);});
            }
        }
    }, [user]);


    function handleMessagesRequest(){
        console.log("handleMessagesRequest called")
        socket.emit('messages_request', sessionId)
    }

    function handleSessionProjectsRequest(){
        console.log("handleSessionProjectsRequest called")
        socket.emit('session_projects_request', sessionId)
    }

    //ON FIRST CONNECT
    useEffect(() => {
        if (connected) {
            socket.emit('join_session', sessionId)
            socket.on('session_projects_fetched', (serverMessage) => {
                console.log("session_projects_fetched:")
                setSessionProjects(serverMessage)
                console.log(serverMessage)
            })
            socket.on('messages_fetched', (serverMessage) => {
                console.log("messages_fetched:")
                setMessages(serverMessage)
                console.log(serverMessage)
            })
            handleSessionProjectsRequest()
            handleMessagesRequest()
        }
        return () => {
            if (socket) {
                socket.removeListener('messages_fetched', (msg) => { console.log(msg);});
                socket.removeListener('session_projects_fetched', (msg) => { console.log(msg);});
            }
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

    //Active Project Setter
    useEffect(() => {
        if (connected) {
            socket.on('active_projects_fetched', (serverMessage) => {
                console.log("active_projects_fetched")
                console.log(messages)
                console.log(serverMessage)
                let updatedActiveProjects = [...activeProjects]
                updatedActiveProjects = [...updatedActiveProjects, serverMessage]
                setActiveProjects(updatedActiveProjects)
            })
        }
        return () => {
            if (socket) {
                socket.removeListener('active_projects_fetched', (msg) => {console.log(msg); });
            }
        }
    }, [activeProjects, connected]);


    console.log(activeProjects)

    // let mappedActiveProject = activeProjects.map((activeProject) => <h4>{activeProject.title}</h4>)

    let mappedActiveProjects = activeProjects.length !== 0 ? activeProjects.map((activeProject) => {
        console.log(activeProject.id)
        return <CodeEditor sessionId={sessionId} connected={connected} socket={socket} user={user} activeProject={activeProject}/>
        }): <h2>No Active Projects</h2>

    return (
        <>
            <div>
                <h1>Session</h1>
            </div>
            <div >
                <ProjectSelector userProjects={userProjects} sessionProjects={sessionProjects} user={user} sessionId={sessionId} socket={socket}/>
            </div>
            <div className="code1">
                {mappedActiveProjects}
            </div>
            {/* <div classname="code1">
                <CodeEditor 
                    sessionId={sessionId} 
                    connected={connected} 
                    socket={socket} 
                    user={user}
                    // codeValue={codeValue1}
                    // setCodeValue={setCodeValue1}
                />
            </div>
            <div classname="code2">
                <CodeEditor 
                    sessionId={sessionId} 
                    connected={connected} 
                    socket={socket} 
                    user={user}
                    // codeValue={codeValue2}
                    // setCodeValue={setCodeValue2}
                />
            </div> */}
            <div>
                <ChatBox messages={messages} user={user} socket={socket} sessionId={sessionId}/>
                <form onSubmit={e => handleSendMessage(e)}>
                    <label>Message:</label>
                    <input onChange={(e) => setNewMessage(e.target.value)} value={newMessage} />
                </form>
            </div>
        </>


    )
}

export default SessionRoom