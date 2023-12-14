import {React, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

function SessionBrowserTile({session, setSessionId}) {
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

  return (
    <div>
      <h2>{sessionTitle}</h2>
      <p>Scheduled date/time: {scheduledTime}</p>
      <button onClick={handleJoinSession}>Join</button>
    </div>
  )
}

export default SessionBrowserTile