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
            <h2 className='text-3xl font-semibold'>Create New Project</h2>
            <form onSubmit={e => handleCreateNewProject(e)} className="flex flex-col gap-2">
                <label className='flex justify-self-start'>Title:</label>
                <input onChange={(e) => setNewProjectTitle(e.target.value)} className='flex flex-grow bg-[#1a1a1a] rounded-xl p-3 text-gray-300' value={newProjectTitle}/>
                <label className='flex justify-self-start'>Description:</label>
                <input onChange={(e) => setNewProjectDesciption(e.target.value)} className='flex flex-grow bg-[#1a1a1a] rounded-xl p-3 text-gray-300' value={newProjectDesciption} />
                <button type="submit">CREATE</button>
            </form>
        </div>
    )
}

export default CreateNewProject