import React from 'react'
import ProjectCard from './ProjectCard'

function ProjectSelector({ userProjects, sessionProjects, user, sessionId, socket }) {

    console.log(sessionProjects)

    let mappedUserProjects = userProjects.length !== 0 ? userProjects.map((project)=> <ProjectCard key={project.id} project={project} owner={user.name} sessionId={sessionId} socket={socket} sessionProjects={sessionProjects}/>) : <h3>You have no projects. Create a project to see them here!</h3>

    let mappedSessionProjects = sessionProjects.length !== 0 ? sessionProjects.map((project)=> <ProjectCard key={project.id} project={project.project} owner={project.project.owner.name} sessionId={sessionId} socket={socket} sessionProjects={sessionProjects}/>) : <h3>No project have been shared with this sessions available. Add a project to the session to see it here!</h3>

    return (
        <div>
            <div>
                <h3>Your Projects:</h3>
                {mappedUserProjects}
            </div>
            <div>
                <h3>Projects Shared with this Session:</h3>
                {mappedSessionProjects}
            </div>
        </div>
    )
}


export default ProjectSelector