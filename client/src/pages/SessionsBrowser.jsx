import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SessionBrowserTile from '../components/SessionBrowserTile';

function SessionsBrowser({ user, sessionId, setSessionId }) {
  const [accessibleSessions, setAccessibleSessions] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    if(user){
      console.log(user.id)
      fetch(`/api/users/${user.id}`)
        .then(res => res.json())
        .then(user => {
          console.log(user.accessible_sessions)
          setAccessibleSessions(user.accessible_sessions)
        })
    }
  }, [user])

  let mappedSessions = accessibleSessions.length !== 0 ? accessibleSessions.map((session) => <SessionBrowserTile key={session.id} session={session} sessionId={sessionId} setSessionId={setSessionId}/>) : <h3>No sessions available. Join a session to see them here!</h3>

  return (
    <div>
      <h2>Sessions</h2>
      {mappedSessions}
    </div>
  )
}

export default SessionsBrowser