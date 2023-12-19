import { React, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react'
import Explorer from './Explorer';

function CodeEditor({ sessionId, connected, socket, user, activeProject /*codeValue, setCodeValue /*fileName*/ }) {
    const [codeValue, setCodeValue] = useState("")
    const [currentDocument, setCurrentDocument] = useState(null)
    const editorRef = useRef(null)

    // console.log(activeProject)
    // console.log(currentDocument)

    useEffect(()=>{
        if(currentDocument){
            setCodeValue(currentDocument.content)
        }
    }, [currentDocument])

    // //monaco testing
    // // monaco testing state
    // const [fileName, setFileName] = useState("script.py")
    // const files = {
    //     "script.py": {
    //         name: "script.py",
    //         language: "python",
    //         value: "scripty.py content here"
    //     },
    //     "index.html": {
    //         name: "index.html",
    //         language: "html",
    //         value: "<div>index.html content here<div/>"
    //     }
    // }
    // const file = files[fileName]

    

    //Monaco Mounts
    function handleEditorDidMount(editor, monaco){
        editorRef.current = editor
    }

    function getEditorValue(){
        console.log(editorRef.current.getValue())
        return editorRef.current.getValue();
    }

    function emitUpdateDocument(user_id, session_id, document_id, edit_content) {
        console.log(`document_id: ${document_id} session_id: ${session_id} edit_content: ${edit_content}` )
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

    

    return (
        <div>
            <div>
                <Explorer activeProject={activeProject} currentDocument={currentDocument} setCurrentDocument={setCurrentDocument}/>
            </div>
            <div className='code_editor'>
                {currentDocument ? <Editor
                    onChange={handleCodeChange}
                    height="100%"
                    width="100%"
                    theme='vs-dark'
                    onMount={handleEditorDidMount}
                    path= {currentDocument ? currentDocument.title : ""}
                    defaultLanguage="python"
                    language={currentDocument ? currentDocument.language : ""}
                    value={codeValue}
                />
                : <h4>Select a Documnet</h4>}
            </div>
        </div>
    )
}

export default CodeEditor