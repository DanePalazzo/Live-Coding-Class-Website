import {React, useState, useEffect} from 'react'

function ProjectCard({ project, owner, sessionId, socket, sessionProjects }) {
    const [inSessionProjects, setInSessionProjects] = useState(false)
    // console.log(project)
    // console.log(owner)
    // console.log(sessionProjects)
    // console.log(sessionProjectIds)

    let sessionProjectIds = sessionProjects.map((project) => project.id)
    // console.log(sessionProjectIds)
    // console.log(project.id)

    useEffect(()=>{
        handleInSessionProjects()
    }, [sessionProjects])

    function handleInSessionProjects(){
        if(sessionProjectIds.includes(project.id)){
            setInSessionProjects(true)
        }else{
            setInSessionProjects(false)
        }
    }

    //Add Project To Session
    function handleAddProjectToSession(){
        socket.emit('add_project_to_session', project.id, sessionId)
    }

    //Active Project Request
    function handleProjectRequest(project_id=project.id, session_id=sessionId){
        socket.emit('active_project_request', project_id, session_id)
    }

    let shareWithSessionModal = 
        <div className='flex flex-grow'>
            <button className="btn btn-outline btn-sm btn-primary" onClick={() => document.getElementById('activate_project_modal').showModal()}>Share Project</button>
            <dialog id="create_new_session_modal" className="modal">
                <div className="modal-box bg-[#111111]">
                    <button className="btn btn-outline btn-block btn-primary" onClick={handleAddProjectToSession}>Share Project with Session</button>
                </div>
            </dialog>
        </div>

    let card =
        <div className="flex justify-center w-80 bg-[#111111] shadow-xl rounded-xl p-1">
            <div className="flex flex-col flex-grow items-center text-center">
                <h2 className="card-title">{project.title}</h2>
                <p>Owner: {owner}</p>
                <div className="flex flex-row justify-end">
                    {shareWithSessionModal}
                    <button className="btn btn-outline btn-sm btn-accent" onClick={() => handleProjectRequest()}>Set As Active</button>
                </div>
            </div>
        </div>

    return (
        <div>
            {card}
        </div>
        // <div>
        //     <h3>{project.title}</h3>
        //     <h4>Owner: {owner}</h4>
        //     <button onClick={(e) => handleProjectRequest()}>Set As Active Project</button>
        //     {!inSessionProjects ? <button onClick={handleAddProjectToSession}>Share Project with Session</button> : null}
        // </div>
    )
}
export default ProjectCard