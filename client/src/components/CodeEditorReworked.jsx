import { React, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react'
import Explorer from './Explorer';
import ActiveProjects from './ActiveProjects';

function CodeEditorReworked({ sessionId, connected, socket, user, activeProjects }) {
    const [codeValue, setCodeValue] = useState("")
    const [currentDocument, setCurrentDocument] = useState(null)
    const [hideExplorer, setHideExplorer] = useState(false)
    const [displayedProject, setDisplayedProject] = useState(null)
    const editorRef = useRef(null)

    useEffect(() => {
        if (currentDocument) {
            setCodeValue(currentDocument.content)
        }
    }, [currentDocument])

    useEffect(() => {
        console.log("useEffect called")
        if(displayedProject){
            let displayedProjectId = displayedProject.id
            console.log(displayedProjectId)
            let updatedDisplayProject = activeProjects.filter((project)=> project.id == displayedProjectId)
            console.log(updatedDisplayProject[0])
            setDisplayedProject(updatedDisplayProject[0])
        }
    },[activeProjects])

    //Monaco Mounts
    function handleEditorDidMount(editor, monaco) {
        editorRef.current = editor
    }

    function getEditorValue() {
        console.log(editorRef.current.getValue())
        return editorRef.current.getValue();
    }

    function emitUpdateDocument(user_id, session_id, document_id, edit_content) {
        console.log(`document_id: ${document_id} session_id: ${session_id} edit_content: ${edit_content}`)
        console.log(`Sent Message: ${edit_content}`)
        socket.emit('document_update', user_id, session_id, document_id, edit_content)
    }

    function handleCodeChange() {
        const newValue = getEditorValue();
        setCodeValue(newValue); // Update state
        emitUpdateDocument(user.id, sessionId, currentDocument.id, newValue); // Emit the update with the new value
    }

    //Return of single new message from server
    useEffect(() => {
        if (connected) {
            socket.on('document_change', (serverMessage) => {
                console.log(`Document Changed: ${serverMessage}`)
                setCodeValue(serverMessage.edit_content)
            })
        }
    }, [connected]);


    let displayProjectExplorer = displayedProject ?
        <Explorer user={user} socket={socket} sessionId={sessionId} displayedProject={displayedProject} currentDocument={currentDocument} setCurrentDocument={setCurrentDocument} />
        : <h4>Select a Project</h4>


    function handleHideExplorer() {
        setHideExplorer(!hideExplorer)
    }

    let editorSpan = hideExplorer ? "col-span-3" : "col-span-2"

    return (
        <div className='h-screen max-h-screen'>
            <div className='flex flex-row justify-between p-2'>
                <label className="swap justify-start">
                    <input type="checkbox" onChange={handleHideExplorer} />
                    <div className="swap-on">SHOW</div>
                    <div className="swap-off">HIDE</div>
                </label>
                <div>
                    {displayedProject ? <h2 className='text-2xl font-bold'>{displayedProject.title}</h2> : <h2 className='text-2xl font-bold'>Select A Project</h2>}
                    {currentDocument ? <h2 className='text-xl font-semibold'>{currentDocument.title}</h2> : <h2 className='text-xl font-semibold'>Select A Document</h2>}
                </div>
                <div>
                    <ActiveProjects user={user} activeProjects={activeProjects} displayedProject={displayedProject} setDisplayedProject={setDisplayedProject}/>
                </div>
            </div>
            <div className='grid grid-cols-3 flex-grow h-full'>
                {!hideExplorer ?
                    <div className='col-span-1 justify-start bg-[#111111] p-3 rounded-xl'>
                        {displayProjectExplorer}
                    </div>
                    : null}
                <div className={`${editorSpan} flex flex-grow h-full justify-center bg-[#111111]`}>
                    {currentDocument ? <Editor
                        onChange={handleCodeChange}
                        height="100%"
                        width="100%"
                        theme='vs-dark'
                        onMount={handleEditorDidMount}
                        path={currentDocument ? currentDocument.title : ""}
                        defaultLanguage="python"
                        language={currentDocument ? currentDocument.language : ""}
                        value={codeValue}
                    />
                        : null}
                </div>
            </div>
        </div>
    )
}

export default CodeEditorReworked