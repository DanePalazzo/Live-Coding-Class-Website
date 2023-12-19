import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SessionBrowserTile from '../components/SessionBrowserTile';
import CreateNewSession from '../components/CreateNewSession';

function SessionsBrowser({ user, setUser, sessionId, setSessionId }) {
  const [accessibleSessions, setAccessibleSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const navigate = useNavigate();

  function toggleCreate() {
    setShowCreate(!showCreate)
  }

  useEffect(()=>{
    setLoading(true)
  }, [])

  useEffect(() => {
    if (user) {
      console.log(user.id)
      fetch(`/api/users/${user.id}`)
        .then(res => res.json())
        .then(user => {
          console.log(user.accessible_sessions)
          setAccessibleSessions(user.accessible_sessions)
          setLoading(false) 
        })
    }
  }, [user])

  let mappedSessions = accessibleSessions.length !== 0 ? accessibleSessions.map((session) => <SessionBrowserTile key={session.id} user={user} setUser={setUser} session={session} setSessionId={setSessionId} />) : <h3>No sessions available. Join a session to see them here!</h3>

  return (
    <div>
      {loading ?
        <h1>LOADING...</h1>
        :
        <div>
          {showCreate ? <CreateNewSession user={user} setUser={setUser} /> : null}
          <button onClick={toggleCreate}>Create New Session</button>
          <h2>Sessions</h2>
          {mappedSessions}
        </div>
      }
    </div>
  )
}

export default SessionsBrowser