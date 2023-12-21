import React, { useState } from 'react';

function Message({ message, user, onEdit, onDelete }) {
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

  function submitEdit(e) {
    e.preventDefault()
    console.log("edit submitted")
    toggleEdit();
  }

  function handleDelete() {
    console.log("Delete")
  }

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
      <div className="flex flex-row chat-footer opacity-50">
          <p className='text-xs text-white' onClick={handleDelete}>🗑️</p>
          <p className='text-xs text-white' onClick={toggleEdit}>✎</p>
      </div>
      {/* Show Edit and Delete buttons only if the current user posted the message */}
      {/* {isUserMessage && (
        <>
          {isEditing ? (
            <button onClick={submitEdit}>SUBMIT</button>
          ) : (
            <button onClick={toggleEdit}>EDIT</button>
          )}
          <button onClick={handleDelete}>DELETE</button>
        </>
      )} */}
    </div>
  );
}

export default Message;