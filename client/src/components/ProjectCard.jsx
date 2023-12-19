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

    function handleAddProjectToSession(){
        socket.emit('add_project_to_session', project.id, sessionId)
    }

    //Active Project Request
    function handleProjectRequest(project_id=project.id, session_id=sessionId){
        socket.emit('active_project_request', project_id, session_id)
    }

    
    return (
        <div>
            <h3>{project.title}</h3>
            <h4>Owner: {owner}</h4>
            <button onClick={(e) => handleProjectRequest()}>Set As Active Project</button>
            {!inSessionProjects ? <button onClick={handleAddProjectToSession}>Share Project with Session</button> : null}
        </div>
    )
}
export default ProjectCard