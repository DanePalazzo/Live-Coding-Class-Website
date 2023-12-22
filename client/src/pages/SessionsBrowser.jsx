import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import SessionBrowserTile from '../components/SessionBrowserTile';
import CreateNewSession from '../components/CreateNewSession';

function SessionsBrowser({ user, setUser, sessionId, setSessionId, setActiveSession }) {
  const [accessibleSessions, setAccessibleSessions] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();


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

  let mappedSessions = accessibleSessions.length !== 0 ? accessibleSessions.map((session) => <SessionBrowserTile key={session.id} user={user} setUser={setUser} session={session} setSessionId={setSessionId} setActiveSession={setActiveSession}/>) : <h3>No sessions available. Join a session to see them here!</h3>


  let createNewSessionModal = <div>
    <button className="btn btn btn-success" onClick={() => document.getElementById('create_new_session_modal').showModal()}>Create New Session</button>
    <dialog id="create_new_session_modal" className="modal">
      <div className="modal-box bg-[#111111]">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <CreateNewSession user={user} setUser={setUser} />
      </div>
    </dialog>
  </div>

  return (
    <div>
      {loading ?
        <span className="loading loading-dots loading-lg inset-1/2"></span>
        :
        <div className='flex flex-col gap-5'>
          <h2 className='text-4xl font-bold'>Sessions</h2>
          {createNewSessionModal}
          <div className='flex flex-row justify-evenly flex-wrap gap-2.5'>
            {mappedSessions}
          </div>
        </div>
      }
    </div>
  )
}

export default SessionsBrowser