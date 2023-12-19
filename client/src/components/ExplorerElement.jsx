import React from 'react'

function ExplorerElement({document, currentDocument, setCurrentDocument}) {
    
    function handleSetCurrentDocument(){
        setCurrentDocument(document)
        console.log(document)
    }

    return (
        <div>
            <h4 onClick={handleSetCurrentDocument}>{document.title}</h4>
        </div>
    )
}
export default ExplorerElement