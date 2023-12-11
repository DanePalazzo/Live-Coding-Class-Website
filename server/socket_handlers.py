from config import socket_io, db, join_room, leave_room
from models import ChatMessage, Document, DocumentEditor


#CONNECTION
@socket_io.on('connect')
def handle_connect(session_id):
    print('new connection')
    join_room(session_id)
    
#DISCONNECT
@socket_io.on("disconnect")
def handle_disconnected():
    print("user disconnected")

#USER MESSAGE
@socket_io.on('user_chat')
def chat_message(user_id, session_id, message_txt):
    print(f"user: {user_id}, session: {session_id}, message: {message_txt}")
    try:
        new_chat_message = ChatMessage(
            user_id=user_id, 
            session_id=session_id, 
            message_text=message_txt
        )
        db.session.add(new_chat_message)
        db.session.commit()
        socket_io.emit('new_message', {'user_id': user_id, 'message': message_txt}, room=session_id)

    except Exception as e:
        db.session.rollback()
        print(f"Error saving message: {e}")

#DOCUMENT UPDATE
@socket_io.on('document_update')
def document_update(user_id, document_id, edit_content):
    print(f"user: {user_id}, document: {document_id}, edited_content: {edit_content}")

    # Update document
    document = Document.query.filter_by(id=document_id).first()
    if not document:
        print(f"Document with id:{document_id} not found")
        return
    try:
        for key, value in edit_content.items():
            if hasattr(document, key):
                setattr(document, key, value)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred while updating document: {e}")

    # Record edit history
    try:
        new_document_edit_history = DocumentEditor(
            document_id=document_id,
            user_id=user_id,
            edit_content=edit_content
        )
        db.session.add(new_document_edit_history)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred in recording document edit history: {e}")