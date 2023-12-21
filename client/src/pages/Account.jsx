import { React, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Account({ user, setUser }) {
  const [key, setKey] = useState(null)
  const [newValue, setNewValue] = useState("")
  const [loading, setLoading] = useState(false)
  let navigate = useNavigate()

  // console.log(user.name)

  function handleSubmitPatch(e){
    if(key === null){
      alert(`Plese select something you would liek to edit!`)
    }else if(newValue.trim().length === 0){
      alert(`Please enter a vlaid ${key}`)
    }else{
      let new_values = { [key]: newValue.trim() };
      console.log(new_values)
      fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(new_values)
      })
      .then(res => {if(res.ok){
          throw new Error(`HTTP error! status: ${res.status}`);
      }
        return res.json()})
      .then(() => {
        setKey(null)
        setNewValue("")
      })
      .then(() => {
        setLoading(true)
        fetch("/api/checksession").then((response) => {
          if (response.ok) {
            response.json().then((user) => {setUser(user); setLoading(false)}); document.getElementById("patch_modal").close()
          }})
        })
      }
    }
  

  let patchModal = 
    <dialog id="patch_modal" className="modal">
      <div className="modal-box bg-[#111111]">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h2 className='uppercase text-3xl font-semibold'>Edit {key}:</h2>
        <form onSubmit={(e) => handleSubmitPatch(e)} className="flex flex-col gap-2">
          <input className='flex flex-grow bg-[#1a1a1a] rounded-xl p-3 text-gray-300' value={newValue} onChange={(e) => setNewValue(e.target.value)}></input>
          <button className="btn btn-outline btn-success">SUBMIT</button>
        </form>
      </div>
    </dialog>


  function handleSetValues(e) {
    let newKey = e.target.value 
    setKey(newKey)
    setNewValue(user[newKey])
    document.getElementById('patch_modal').showModal()
    console.log(newKey)
    console.log(user[newKey])
  }

  return (
    <div className='flex justify-center p-5'>
      {loading ?
      <span className="loading loading-dots loading-lg inset-1/2"></span>
        :
      <div className="flex flex-col flex-grow justify-center bg-[#111111] w-1/2 rounded-xl gap-2">
          <h2 className='flex flex-row mx-auto my-3 text-3xl font-bold'>Account</h2>
          <div className="flex flex-col w-1/3 justify-center gap-2 self-center">
            <div className="flex flex-row w-full self-center gap-1 text-lg"> 
              <h2 className='font-bold'>Name: </h2>
              {user ? <h2>{user.name}</h2> : null}
              <button className='btn btn-sm btn-circle btn-ghost' value={"name"} onClick={(e)=> handleSetValues(e)}>✎</button>
            </div>
            <div className="flex flex-row w-full self-center gap-1 text-lg"> 
              <h2 className='font-bold'>Username: </h2>
              {user ? <h2>{user._username}</h2> : null}
              <button className='btn btn-sm btn-circle btn-ghost' value={"_username"} onClick={(e)=> handleSetValues(e)}>✎</button>
            </div>
            <div className="flex flex-row w-full self-center gap-1 text-lg"> 
              <h2 className='font-bold'>Email: </h2>
              {user ? <h2>{user._email}</h2> : null}
              <button className='btn btn-sm btn-circle btn-ghost' value={"_email"} onClick={(e)=> handleSetValues(e)}>✎</button>
            </div>
            <div className="flex flex-row w-full self-center gap-1 text-lg"> 
              <h2 className='font-bold'>Role: </h2>
              {user ? <h2>{user.role}</h2> : null}
            </div>
            <div>
              {patchModal}
            </div>
          </div>
      </div>
      }
    </div>
  )
}

export default Account