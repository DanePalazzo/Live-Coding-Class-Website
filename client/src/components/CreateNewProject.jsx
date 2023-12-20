import {React, useState, useEffect} from 'react'

function CreateNewProject({user, socket, sessionId}) {
    const [newProjectTitle, setNewProjectTitle] = useState("")
    const [newProjectDesciption, setNewProjectDesciption] = useState("")

    function handleCreateNewProject(e){
        e.preventDefault()
        socket.emit('create_new_project_in_session', user.id, sessionId, newProjectTitle, newProjectDesciption)
    }

    return (
        <div>
            <h2>CreateNewProject</h2>
            <form onSubmit={e => handleCreateNewProject(e)}>
                <label>Title:</label>
                <input onChange={(e) => setNewProjectTitle(e.target.value)} value={newProjectTitle} />
                <label>Description:</label>
                <input onChange={(e) => setNewProjectDesciption(e.target.value)} value={newProjectDesciption} />
                <button type="submit">CREATE</button>
            </form>
        </div>
    )
}

export default CreateNewProject