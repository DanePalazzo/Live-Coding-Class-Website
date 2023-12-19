import { React, useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react'
import Explorer from './Explorer';

function CodeEditor({ sessionId, connected, socket, user, codeValue, setCodeValue /*fileName*/ }) {
    const [currentCodeValue, setCurrentCodeValue] = useState("")
    // monaco testing state
    const [fileName, setFileName] = useState("script.py")
    const editorRef = useRef(null)

    //monaco testing
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

    

    //Makes sute monaco Mounts
    function handleEditorDidMount(editor, monaco){
        editorRef.current = editor
    }

    function getEditorValue(){
        console.log(editorRef.current.getValue())
        return editorRef.current.getValue();
    }

    function emitUpdateDocument(user_id = user.id, session_id = sessionId, document_id = 9, edit_content = codeValue) {
        console.log(`Sent Message: ${edit_content}`)
        socket.emit('document_update', user_id, session_id, document_id, edit_content)
    }

    function handleCodeChange() {
        const newValue = getEditorValue();
        setCodeValue(newValue); // Update state
        emitUpdateDocument(user.id, sessionId, newValue); // Emit the update with the new value
    }

    //Return of single new message from server
    useEffect(() => {
        if (connected) {
            socket.on('document_change', (serverMessage) => {
                // console.log(serverMessage)
                setCodeValue(serverMessage)
            })
        }
    }, [/*currentCodeValue,*/ connected]);


    let mappedDocuments

    return (
        <div>
            <div className='code_editor'>
                <Editor
                    onChange={handleCodeChange}
                    height="100%"
                    width="100%"
                    theme='vs-dark'
                    onMount={handleEditorDidMount}
                    path={file.name}
                    defaultLanguage={file.language}
                    value={currentCodeValue}
                />
            </div>
            <div>
                <Explorer/>
            </div>
        </div>
    )
}

export default CodeEditor