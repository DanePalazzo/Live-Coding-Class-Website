import {React, useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

function SessionBrowserTile({user, setUser, session, setSessionId}) {
  const [sessionTitle, setSessionTitle] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [sessionOptionId, setSessionOptionId] = useState(null)
  const [sessionDescription, setSessionDescription] = useState("")

  const navigate = useNavigate();

  // Renders the title and time when the element loads in a useEffect to prevent loops
  useEffect(()=>{
    setSessionTitle(session.session.title)
    setSessionOptionId(session.session.id)
    setSessionDescription(session.session.description)
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


  let removeSessionModal = 
    <div>
      <button className="btn btn-sm btn-outline btn-error" onClick={() => document.getElementById('remove_session_modal').showModal()}>REMOVE</button>
      <dialog id="remove_session_modal" className="modal">
        <div className="modal-box bg-[#111111]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Are you sure you would like to leave:</h3>
          <p className="py-4">{sessionTitle}?</p>
          <div>
            <button className="btn btn-outline btn-error"onClick={handleDeleteProjectParticipant}>PERMANENTLY LEAVE: {sessionTitle}</button>
          </div>
        </div>
      </dialog>
    </div>

  return (
      <div className="card w-96 bg-[#111111] shadow-xl">
        <div className="card-body">
          <div className='flex flex-row justify-between'>
            <h2 className="card-title">{sessionTitle}</h2>
            {removeSessionModal}
          </div>
          <p className='text-left'>{sessionDescription}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-outline btn-block btn-accent" onClick={handleJoinSession}>Join</button>
          </div>
        </div>
      </div>
  )
}

export default SessionBrowserTile