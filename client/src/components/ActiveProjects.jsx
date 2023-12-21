import { React, useState, useEffect } from 'react'

function ActiveProjects({ user, activeProjects, displayedProject, setDisplayedProject }) {
    const [displayedProjectId, setDisplayedProjectId] = useState(null)
    // const [isDisplaying, setIsDisplaying] = useState(false)
    // let tabClassName = isDisplaying ? "tab tab-active" : "tab"

    // console.log(activeProjects)
    // console.log(displayedProject)

    useEffect(() => {
        if (displayedProject) {
            setDisplayedProjectId(displayedProject.id)
        }
    }, [displayedProject])

    let activProjectSelector = activeProjects.length !== 0 ?
        activeProjects.map((activeProject) =>
            <li><a key={activeProject.id} onClick={(e) => handleSetDisplayedProject(e, activeProject)}>{activeProject.title}</a></li>)
        : <li><a>No Active Projects</a></li>

    let activProjectDropdown =
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-primary m-1">Active Projects</div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-[#111111] rounded-box w-52">
                {activProjectSelector}
            </ul>
        </div>

    // let activeProjectOptions = activeProjects.length !== 0 ?
    //     activeProjects.map((activeProject) =>
    //         <option key={activeProject.id} value={activeProject}>{activeProject.title}</option>)
    //     : <option disabled selected>select a project</option>
    
    // let activeProjectSelect = 
    // <select className="select w-full max-w-xs" onChange={(e) => handleSetDisplayedProject(e.target.value)}>
    //     <option disabled selected>select a project</option>
    //     {activeProjectOptions}
    //     </select>


    function handleSetDisplayedProject(e, project){
        console.log(project)
        setDisplayedProject(project)
    }

    return (
        <div>
            {/* {activeProjectSelect} */}
            {activProjectDropdown}
        </div>
    )
}
export default ActiveProjects