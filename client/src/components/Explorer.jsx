import {React, useState} from 'react'
import ExplorerElement from './ExplorerElement'
import CreateNewDocument from './CreateNewDocument'

function Explorer({ user, socket, sessionId, displayedProject, currentDocument, setCurrentDocument, activeProjects}) {
    // const [explorerDocuments, setExplorerDocuments] = useState(<h4>Select A Project.</h4>)
    console.log(displayedProject)


    let explorerDocuments = 
        displayedProject ?
            displayedProject.documents.length !== 0 ? 
                displayedProject.documents.map((document) => <ExplorerElement key={document.id} document={document} currentDocument={currentDocument} setCurrentDocument={setCurrentDocument}/>) 
                : <h4>This Project has no Documents.</h4>
            : <h4>Select A Project.</h4>

    

     
    let createDocumentModal =
        <div>
            <button className="btn btn btn-success" onClick={() => document.getElementById('create_document_modal').showModal()}>CREATE NEW DOCUMENT</button>
            <dialog id="create_document_modal" className="modal">
                <div className="modal-box bg-[#111111]">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <CreateNewDocument user={user} socket={socket} sessionId={sessionId} displayedProject={displayedProject}/>
                </div>
            </dialog>
        </div>

    return (
        <div>
            <h2 className='text-xl font-bold'>EXPLORER</h2>
            {createDocumentModal}
            <div>{explorerDocuments}</div>
        </div>
    )
}

export default Explorer