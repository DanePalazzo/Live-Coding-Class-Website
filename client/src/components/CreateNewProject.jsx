import {React, useState, useEffect} from 'react'

function CreateNewProject({user, socket, sessionId}) {
    const [newProjectName, setNewProjectName] = useState("")
    const [newProjectDesciption, setNewProjectDesciption] = useState("")

    useEffect(()=>{
        socket.on("new_project_fetched")
    })

    function handleCreateNewProject(){
        
    }

    return (
        <div>
            <h2>CreateNewProject</h2>
            <form onSubmit={e => handleSendMessage(e)}>
                <label>Message:</label>
                <input onChange={(e) => setNewProjectName(e.target.value)} value={newProjectName} />
                <input onChange={(e) => setNewProjectDesciption(e.target.value)} value={newProjectDesciption} />
                <button type="submit">CREATE</button>
            </form>
        </div>
    )
}

export default CreateNewProject