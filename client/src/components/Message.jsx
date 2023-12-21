import React, { useState } from 'react';

function Message({ socket, message, user, sessionId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message_text);


  // Check if the current user is the one who posted the message
  const isUserMessage = user.id === message.user.id;

  const chatType = isUserMessage ? "chat chat-start" : "chat chat-end"

  function toggleEdit() {
    setIsEditing(!isEditing);
    setEditedMessage(message.message_text);
  }

  function handleEditChange(e) {
    setEditedMessage(e.target.value);
  }

  function handleEdit(e) {
    e.preventDefault()
    console.log("edit submitted")
    socket.emit('edit_message', user.id, sessionId, message.id, editedMessage)
  }

  function handleDelete(e) {
    console.log("Delete")
    socket.emit('delete_message', user.id, sessionId, message.id)
  }


  let deleteModal = 
    <div>
      <p className='text-xs text-white' onClick={()=>document.getElementById('delete_chat_modal').showModal()}>🗑️</p>
      <dialog id="delete_chat_modal" className="modal">
        <div className="modal-box bg-[#111111]">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Delete this message?</h3>
          <p className="py-4">{message.message_text}</p>
          <button className="btn btn-outline btn-error" onClick={(e) => handleDelete(e)}>DELETE</button>
        </div>
      </dialog>
    </div>

  let editModal = 
  <div>
    <p className='text-xs text-white' onClick={()=>document.getElementById('edit_chat_modal').showModal()}>✎</p>
    <dialog id="edit_chat_modal" className="modal">
      <div className="flex flex-col justify-center modal-box bg-[#111111] gap-2">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Edit Message:</h3>
        <form className='flex flex-col justify-center gap-2' onSubmit={(e) => handleEdit(e)}>
          <input 
          className='flex flex-grow bg-[#1a1a1a] rounded-md p-1 text-gray-200'
          value={editedMessage}
          onChange={(e)=>setEditedMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-outline btn-success">EDIT</button>
        </form>
      </div>
    </dialog>
  </div>

  return (
    <div className={chatType}>
      <div className="chat-header">
        {message.user.name}
      </div>
      <div className="flex flex-row max-w-fit chat-bubble">
        {isEditing ? (
          <form onSubmit={(e) => submitEdit(e)}>
            <input 
            className='flex flex-grow bg-[#1a1a1a] rounded-md p-1 text-gray-400'
            type="text" 
            value={editedMessage} 
            onChange={handleEditChange} />
          </form>
        ) : (
          <p className='text-left'>{message.message_text}</p>
        )}
      </div>
      {isUserMessage ?
      <div className="flex flex-row chat-footer opacity-50">
          {/* <p className='text-xs text-white' onClick={handleDelete}>🗑️</p> */}
          {deleteModal}
          {editModal}
          {message.edited ? <p className='flex justify-self-end'>edited</p> : null}
          {/* <p className='text-xs text-white' onClick={toggleEdit}>✎</p> */}
      </div> :
      null }
    </div>
  );
}

export default Message;