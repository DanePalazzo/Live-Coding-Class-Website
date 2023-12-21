import React from 'react'

function ExplorerElement({document, currentDocument, setCurrentDocument}) {
    
    function handleSetCurrentDocument(){
        setCurrentDocument(document)
        console.log(document)
    }

    return (
        <div>
            <button className="btn btn-sm btn-ghost" onClick={handleSetCurrentDocument}>{document.title}</button>
        </div>
    )
}
export default ExplorerElement