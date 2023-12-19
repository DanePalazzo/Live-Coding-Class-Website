import {React, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

function SessionBrowserTile({user, setUser, session, setSessionId}) {
  const [sessionTitle, setSessionTitle] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [sessionOptionId, setSessionOptionId] = useState(null)

  const navigate = useNavigate();

  // Renders the title and time when the element loads in a useEffect to prevent loops
  useEffect(()=>{
    setSessionTitle(session.session.title)
    setSessionOptionId(session.session.id)
    setScheduledTime(session.session.scheduled_time)
  }, [])

  // Joins the room
  function handleJoinSession(){
    console.log(session.session.id)
    setSessionId(session.session.id)
    navigate('/sessionroom')
    // console.log(session.session.id)
  }

  //Remove Session
  function handleDeleteProjectParticipant(){
    if(confirm("Are you sure you want to remove youself from this session's participants?")){
        fetch(`/api/sessionparticipants/${session.id}`, {
            method: "DELETE"
        })
        .then(res => {
            console.log("Spreading User...")
            let updatedUser = {...user}
            updatedUser.accessible_sessions = updatedUser.accessible_sessions.filter((accessible_session) => accessible_session.id !== session.id)
            console.log("Setting User...")
            setUser(updatedUser)
        })
    }
}

  return (
    <div>
      <h2>{sessionTitle}</h2>
      <button onClick={handleJoinSession}>Join</button>
      <button onClick={handleDeleteProjectParticipant}>REMOVE SESSION</button>
    </div>
  )
}

export default SessionBrowserTile