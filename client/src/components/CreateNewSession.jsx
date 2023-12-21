import {React, useState, useEffect} from 'react'

function CreateNewSession({user, setUser}) {
    const [userCourses, setUserCourses] = useState([])
    const [newSessionTitle, setNewSessionTitle] = useState("")
    const [newSessionCourse, setNewSessionCourse] = useState(null)

    console.log(user)

    useEffect(()=>{
        if(user){
            let userCourseList = user.enrollments.length !== 0 ? user.enrollments.map((enrollment) => enrollment.course) : null
            console.log(userCourseList)
            setUserCourses(user)     
        }
    }, [user])

    function handleNewSession(e){
        e.preventDefault()
        if(newSessionTitle.length == 0){
            alert("Please enter a title for the session")
        }else{
            let newSession = {
                title: newSessionTitle,
                course_id: newSessionCourse
            }
            fetch('/api/sessions', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newSession)
            })
            .then(res => res.json())
            .then(res => {
                console.log("Calling handleProjectParticipant...")
                handleProjectParticipant(res.id)
            })
        }
    }

    function handleProjectParticipant(sessionId){
        let newSessionParticipant = {
            session_id: sessionId,
            user_id: user.id
        }
        fetch('/api/sessionparticipants', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(newSessionParticipant)
        })
        .then(res => res.json())
        .then(res => {
            console.log("Spreading User...")
            let updatedUser = {...user}
            updatedUser.accessible_sessions = [...updatedUser.accessible_sessions, res]
            console.log("Setting User...")
            setUser(updatedUser)
        })
    }


    // let classSelectOptions = userCourses.map((course)=> course)

    console.log(userCourses)

    //implement class to add session to with select ****************************************************************************
    let classSelect = 
    <select className="select w-full max-w-xs">
        <option disabled selected>Choose a class to tie the session to</option>
        <option>Homer</option>
        <option>Marge</option>
        <option>Bart</option>
        <option>Lisa</option>
        <option>Maggie</option>
    </select>

    return (
        <div>
            <h2 className='text-3xl font-semibold'>Create New Session</h2>
            <form onSubmit={e => handleNewSession(e)} className="flex flex-col gap-2">
                <label className='flex justify-self-start'>Session Title:</label>
                <input onChange={(e) => setNewSessionTitle(e.target.value)} className='flex flex-grow bg-[#1a1a1a] rounded-xl p-3 text-gray-300' value={newSessionTitle} />
                <button type="submit" className='btn btn-ghost'>CREATE</button>
            </form>
            
        </div>
    )
}

export default CreateNewSession