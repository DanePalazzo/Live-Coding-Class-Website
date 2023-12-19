import {React, useState, useEffect} from 'react'

function CreateNewSession({user, setUser}) {
    const [userCourses, setUserCourses] = useState([])
    const [newSessionTitle, setNewSessionTitle] = useState("")
    const [newSessionCourse, setNewSessionCourse] = useState(null)

    console.log(user)

    useEffect(()=>{
        let userCourseList = user.enrollments.length !== 0 ? user.enrollments.map((enrollment) => enrollment.course) : null
        console.log(userCourseList)
        setUserCourses(user)
    }, [])

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

    return (
        <div>
            <h2>CreateNewSession</h2>
            <form onSubmit={e => handleNewSession(e)}>
                <input onChange={(e) => setNewSessionTitle(e.target.value)} value={newSessionTitle} />
                <button type="submit">CREATE</button>
            </form>
            
        </div>
    )
}

export default CreateNewSession