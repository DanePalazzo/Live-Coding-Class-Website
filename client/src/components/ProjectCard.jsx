import React from 'react'

function ProjectCard({ project, owner, sessionId, socket }) {

    // console.log(project.id)
    
    // console.log(owner)

    //Active Project Request
    function handleProjectRequest(project_id=project.id, session_id=sessionId){
        socket.emit('active_project_request', project_id, session_id)
    }

    
    return (
        <div>
            <h3>{project.title}</h3>
            <h4>Owner: {owner}</h4>
            <button onClick={(e) => handleProjectRequest()}>Set As Active Project</button>
        </div>
    )
}
export default ProjectCard