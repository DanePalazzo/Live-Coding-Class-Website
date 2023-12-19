import React from 'react'
import ExplorerElement from './ExplorerElement'

function Explorer({ activeProject, currentDocument, setCurrentDocument}) {

    console.log(activeProject)
    let mappedDocuments = activeProject.documents.length !== 0 ? activeProject.documents.map((document) => <ExplorerElement key={document.id} document={document} currentDocument={currentDocument} setCurrentDocument={setCurrentDocument}/>) : <h4>This Project has no Documents.</h4>

    return (
        <div>
            <h2>Explorer</h2>
            <div>{mappedDocuments}</div>
        </div>
    )
}

export default Explorer