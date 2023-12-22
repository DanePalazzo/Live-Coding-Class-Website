import { React, useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import Chat from '../components/Chat'
import Document from '../components/Document';
import CodeEditor from '../components/CodeEditor'
import ProjectSelector from '../components/ProjectSelector'
import Editor from '@monaco-editor/react'
import CreateNewProject from '../components/CreateNewProject';
import CodeEditorReworked from '../components/CodeEditorReworked';


function SessionRoom({ user, sessionId, setSessionId, activeSession, setActiveSession}) {
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
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([])
    const [connected, setConnected] = useState(false)
    const [userProjects, setUserProjects] = useState([])
    const [sessionProjects, setSessionProjects] = useState([])
    const [activeProjects, setActiveProjects] = useState([])
    const [hideChat, setHideChat] = useState(false)
    const [createLoading, setCreateLoading] = useState(false)
    const location = useLocation();

    const activeProjectDocuments = activeProjects.map((activeProject) => activeProject.documents)
    const flattenedDocuments = activeProjectDocuments.flat();

    // console.log(activeProjectDocuments)
    // console.log(flattenedDocuments)
    console.log(activeProjects)
    //refs for setting state in useEffects
    const activeProjectsRef = useRef(activeProjects)
    useEffect(() => {
        activeProjectsRef.current = activeProjects;
    }, [activeProjects]);


    //socket connect
    useEffect(() => {
        if(user && user.projects){
            const newSocket = io('ws://localhost:5555');
            setSocket(newSocket);
            setConnected(true)
            setUserProjects(user.projects)
        }
        return () => {
            if (socket) {
                socket.emit('leave_room', sessionId, user.id)
                socket.disconnect();
                setConnected(false)
            }
        }
    }, [user, location.pathname]);


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
        if (connected && user) {
            socket.emit('join_session', sessionId, user.id)
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

    //Active Project Setter and created_new_documets
    useEffect(() => {
        if (connected) {
            socket.on('active_projects_fetched', (serverMessage) => {
                console.log("active_projects_fetched")
                // console.log(messages)
                console.log(serverMessage)
                let updatedActiveProjects = [...activeProjects]
                updatedActiveProjects = [...updatedActiveProjects, serverMessage]
                setActiveProjects(updatedActiveProjects)
            })
        }
        return () => {
            if (socket) {
                socket.removeListener('active_projects_fetched', (msg) => {console.log(msg); });
                socket.removeListener('created_new_document', (msg) => {console.log(msg); });
            }
        }
    }, [activeProjects, connected]);

    useEffect(() => {
        if (connected) {
            socket.on('created_new_document', (serverMessage) => {
                const newDocument = serverMessage.new_document;
                const projectIdToUpdate = newDocument.project.id;
                console.log(serverMessage)
                setActiveProjects(currentProjects => 
                    currentProjects.map(project => 
                        project.id === projectIdToUpdate 
                            ? { ...project, documents: [...project.documents, newDocument] } 
                            : project
                    )
                );
            });
        }
        return () => {
            if (socket) {
                socket.removeListener('created_new_document', (msg) => {console.log(msg); });
            }
        }
    }, [connected]);

    //Project Added To Session WIP ************************************************************************************
    useEffect(()=> {
        if (connected) {
            socket.on('project_added_to_session', (serverMessage) => {
                console.log("project_added_to_session")
                console.log(sessionProjects)
                console.log(serverMessage)
                let updatedSessionProjects = [...sessionProjects]
                updatedSessionProjects = [...updatedSessionProjects, serverMessage]
                setSessionProjects(updatedSessionProjects)
            })
        }
        return () => {
            if (socket) {
                socket.removeListener('project_added_to_session', (msg) => {console.log(msg); });
            }
        }
    }, [connected, sessionProjects])

    //Project Added to Personal Projects
    useEffect(()=> {
        if (connected) {
            socket.on('project_created', (serverMessage) => {
                console.log("project_created")
                console.log(userProjects)
                console.log(serverMessage)
                let updatedUserProjects = [...userProjects]
                updatedUserProjects = [...updatedUserProjects, serverMessage]
                setUserProjects(updatedUserProjects)
                setCreateLoading(false)
                document.getElementById('create_project_modal').close()
            })
        }
        return () => {
            if (socket) {
                socket.removeListener('project_created', (msg) => {console.log(msg); });
            }
        }
    }, [connected, userProjects])


    // console.log(activeProjects)


    //Session Disconnect
    function handleDisconnect(){
        if (socket) {
            socket.disconnect()
            setConnected(false)
            setSessionId(null)
            setActiveSession(null)
        }
        navigate('/sessionsbrowser')
    }

    let hideChatButton = hideChat ? <button onClick={handleHideChat} className='btn btn-secondary text-white'>SHOW CHAT</button> : <button onClick={handleHideChat} className='btn btn-outline btn-secondary'>HIDE CHAT</button>

    //Hide Chat
    function handleHideChat(){
        setHideChat(!hideChat)
    }

    //Code Editor Map
    // let mappedActiveProjects = activeProjects.length !== 0 ? 
    //     activeProjects.map((activeProject) => {
    //         return <CodeEditor sessionId={sessionId} connected={connected} socket={socket} user={user} activeProject={activeProject}/>
    // }) : <h2>No Active Projects</h2>

    let gridColSetter = hideChat ? "grid grid-cols-4" : "grid grid-cols-5"


    //Create Project
    let createProjectModal = 
        <div>
            <button className="btn btn btn-success" onClick={() => document.getElementById('create_project_modal').showModal()}>Create New Project</button>
            <dialog id="create_project_modal" className="modal">
                <div className="modal-box bg-[#111111]">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <CreateNewProject user={user} socket={socket} sessionId={sessionId} createLoading={createLoading} setCreateLoading={setCreateLoading}/>
                </div>
            </dialog>
        </div>

    let pageContentsReworked = 
    <div className='w-full'>
        <div className='navbar bg-green-100 bg-opacity-20'>
            <div className="navbar-start">
                <label htmlFor="my-drawer" className="btn btn-outline btn-primary drawer-button">Projects</label>
            </div>
            <div className="navbar-center">
                {activeSession?<h1 className='text-[#111111] font-extrabold'>{activeSession.title}</h1>:<span className="loading loading-dots loading-md text-neutral"></span>}
            </div>
            <div className="navbar-end">
                <div className='flex flex-row gap-2'>
                    {hideChatButton}
                    <button onClick={handleDisconnect} className='btn btn-outline btn-error'>LEAVE SESSION</button>
                </div>
            </div>           
        </div>
        <div className={gridColSetter}>
            <div className='col-span-2 bg-[#1a1a1a]'>
                <CodeEditorReworked sessionId={sessionId} connected={connected} socket={socket} user={user} activeProjects={activeProjects}/>
            </div>
            <div className='col-span-2 bg-[#2a2a2a]'>
                <CodeEditorReworked sessionId={sessionId} connected={connected} socket={socket} user={user} activeProjects={activeProjects}/>
            </div>
            <div className='col-span-1'>
                {!hideChat ? <Chat messages={messages} user={user} socket={socket} sessionId={sessionId} connected={connected} setMessages={setMessages} /> : null}
            </div>
        </div>
    </div>

    let projectSelectorDrawer = 
        <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                {pageContentsReworked}
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-100 min-h-full bg-base-200 text-base-content">
                    {/* Sidebar content here */}
                    {createProjectModal}
                    <ProjectSelector userProjects={userProjects} sessionProjects={sessionProjects} user={user} sessionId={sessionId} socket={socket} />
                </ul>
            </div>
        </div>

    return (
        <div>
            {projectSelectorDrawer}
        </div>
    )
}

export default SessionRoom