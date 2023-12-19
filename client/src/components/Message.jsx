import React, { useState } from 'react';

function Message({ message, user, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message.message_text);

  // Check if the current user is the one who posted the message
  const isUserMessage = user.id === message.user.id;

  function toggleEdit() {
    setIsEditing(!isEditing);
    setEditedMessage(message.message_text);
  }

  function handleEditChange(e) {
    setEditedMessage(e.target.value);
  }

  function submitEdit() {
    onEdit(message.id, editedMessage);
    toggleEdit();
  }

  function handleDelete() {
    onDelete(message.id);
  }





  return (
    <div>
      <p>{message.user.name}:</p>
      {isEditing ? (
        <input type="text" value={editedMessage} onChange={handleEditChange} />
      ) : (
        <p>{message.message_text}</p>
      )}

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