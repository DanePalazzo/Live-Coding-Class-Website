import { React, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Chat from '../components/Chat'
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
    const [connected, setConnected] = useState(false)
    const [userProjects, setUserProjects] = useState([])
    const [sessionProjects, setSessionProjects] = useState([])
    const [activeProjects, setActiveProjects] = useState([])


    // console.log(userProjects)

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

    //Project Added To Session WIP ************************************************************************************
    useEffect(()=> {
        if (connected) {
            socket.on('project_added_to_session', (serverMessage) => {
                console.log("project_added_to_session")
                console.log(messages)
                console.log(serverMessage)
                let updatedActiveProjects = [...activeProjects]
                updatedActiveProjects = [...updatedActiveProjects, serverMessage]
                setActiveProjects(updatedActiveProjects)
            })
        }
        return () => {
            if (socket) {
                socket.removeListener('project_added_to_session', (msg) => {console.log(msg); });
            }
        }
    }, [])

    console.log(activeProjects)

    // let mappedActiveProject = activeProjects.map((activeProject) => <h4>{activeProject.title}</h4>)

    //Code Editor Map
    let mappedActiveProjects = activeProjects.length !== 0 ? activeProjects.map((activeProject) => {
        console.log(activeProject.id)
        return <CodeEditor sessionId={sessionId} connected={connected} socket={socket} user={user} activeProject={activeProject}/>
        }): <h2>No Active Projects</h2>

    return (
        <>
            <div>
                <h1>Session</h1>
            </div>
            <div>
                <ProjectSelector userProjects={userProjects} sessionProjects={sessionProjects} user={user} sessionId={sessionId} socket={socket}/>
            </div>
            <div className="code1">
                {mappedActiveProjects}
            </div>
            <div>
                <Chat messages={messages} user={user} socket={socket} sessionId={sessionId} connected={connected} setMessages={setMessages}/>
            </div>
        </>


    )
}

export default SessionRoom