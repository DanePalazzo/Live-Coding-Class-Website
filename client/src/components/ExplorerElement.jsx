import React from 'react'

function ExplorerElement({document, currentDocument, setCurrentDocument}) {
    
    function handleSetCurrentDocument(){
        setCurrentDocument(document)
        console.log(document)
    }

    return (
        <div className='flex flex-row justify-between'>
            <button className="btn btn-sm btn-ghost" onClick={handleSetCurrentDocument}>{document.title}</button>
            <p className='text-xs'>{document.language}</p>
        </div>
    )
}
export default ExplorerElement