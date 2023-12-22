from config import request, socket_io, db, join_room, leave_room
from models import ChatMessage, Document, Session, Project, SessionParticipant, ProjectSession


#CONNECTION
@socket_io.on('connect')
def handle_connect():
    print('new connection')


#JOIN ROOM
@socket_io.on('join_session')
def handle_join_room(session_id, user_id):
    print(session_id)
    join_room(session_id)
    session_participant = SessionParticipant.query.filter_by(user_id=user_id, session_id=session_id).first()
    if session_participant:
        session_participant.is_active = True
        db.session.commit()

#LEAVE ROOM
@socket_io.on('leave_session')
def handle_leave_room(session_id, user_id):
    print(session_id)
    leave_room(session_id)
    session_participant = SessionParticipant.query.filter_by(user_id=user_id, session_id=session_id).first()
    if session_participant:
        session_participant.is_active = False
        db.session.commit()

#DISCONNECT
@socket_io.on('disconnect')
def handle_disconnected():
    print("user disconnected")

#MESSAGE REQUEST
@socket_io.on("messages_request")
def messages_request(session_id):
    print(f"Recieved messages_request from session_id: {session_id}")
    session = Session.query.filter_by(id=session_id).first()
    messages = [message.to_dict() for message in session.messages]
    print(messages)
    socket_io.emit('messages_fetched', messages, room=session_id)

#USER MESSAGE
@socket_io.on('user_message')
def user_message(user_id, session_id, message_txt):
    print(f"Message Recieved! user: {user_id}, session: {session_id}, message: {message_txt}")
    try:
        new_chat_message = ChatMessage(
            user_id=user_id, 
            session_id=session_id, 
            message_text=message_txt
        )
        db.session.add(new_chat_message)
        db.session.commit()
        print(f"Message Added: {message_txt}")
        print(f'emmiting: {new_chat_message.to_dict()}')
        socket_io.emit('new_message', new_chat_message.to_dict(), room=session_id)

    except Exception as e:
        db.session.rollback()
        print(f"Error saving message: {e}")

#DELETE MESSAGE
@socket_io.on('delete_message')
def edit_message(user_id, session_id, chat_message_id):
    print(f"Delete Recieved! user: {user_id}, message: {chat_message_id} session: {session_id}")
    message = ChatMessage.query.filter_by(id=chat_message_id).first()
    if not message:
        return {"error": f"Chat with the id: {chat_message_id} not found"}, 404
    db.session.delete(message)
    db.session.commit()
    socket_io.emit('message_deleted', chat_message_id, room=session_id)

#EDIT MESSAGE
@socket_io.on('edit_message')
def edit_message(user_id, session_id, chat_message_id, new_message_txt):
    print(f"Edit Recieved! user: {user_id}, message: {chat_message_id} session: {session_id}, message: {new_message_txt}")
    message = ChatMessage.query.filter_by(id=chat_message_id).first()
    if not message:
        return {"error": f"Chat with the id: {chat_message_id} not found"}, 404
    try:
        setattr(message, "message_text", new_message_txt)
        setattr(message, "edited", True)
        db.session.commit()
        socket_io.emit('message_edited', message.to_dict(), room=session_id)
    except Exception as e:
        db.session.rollback()
        print(f"Error saving message: {e}")

#FETCHES PROJECTS
@socket_io.on('session_projects_request')
def get_session_projects(session_id):
    print(f"Recieved session_projects_request from session_id: {session_id}")
    session = Session.query.filter_by(id=session_id).first()
    projects = [project.to_dict() for project in session.projects]
    print(projects)
    socket_io.emit('session_projects_fetched', projects, room=session_id)

#FETCHES FOR ACTIVE PROJECT
@socket_io.on('active_project_request')
def project_fetch(project_id, session_id):
    print(f"Recieved active_project_request from session_id: {session_id}")
    project = Project.query.filter_by(id=project_id).first()
    # Get the client's unique session ID
    client_session_id = request.sid
    print(project.to_dict())
    socket_io.emit('active_projects_fetched', project.to_dict(), room=client_session_id)


#CREATE NEW DOCUMENT IN SESSION
@socket_io.on('create_new_document_in_project')
def handle_create_new_document_in_project(user_id, session_id, project_id, new_document_title, new_document_language):
    print(f"New Document Recieved! user: {user_id}, session_id:{session_id}, document_title: {new_document_title}, new_document_language: {new_document_language}")
    try:
        new_document = Document(
            project_id = project_id,
            title = new_document_title,
            language = new_document_language,
            content = ""
        )
        db.session.add(new_document)
        db.session.commit()
        print(new_document.to_dict())
        document_session_ids = [session.id for session in new_document.project.sessions]
        if session_id in document_session_ids:
            socket_io.emit('created_new_document', {"user_id": user_id, "new_document": new_document.to_dict()}, room=session_id)
            print("emited to room")
        else:
            client_session_id = request.sid
            socket_io.emit('created_new_document', {"user_id": user_id, "new_document": new_document.to_dict()}, room=client_session_id)
            print("emited to submitter")
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred while updating document: {e}")


#DOCUMENT UPDATE
@socket_io.on('document_update')
def document_update(user_id, session_id, document_id, edit_content):
    print(f"user: {user_id}, document: {document_id}, edited_content: {edit_content}")

    # Update document
    document = Document.query.filter_by(id=document_id).first()
    if not document:
        print(f"Document with id:{document_id} not found")
        return
    try:
        setattr(document, "content", edit_content)
        db.session.commit()
        socket_io.emit('document_change', {"user_id": user_id, "document_id": document_id, "edited_content": edit_content}, room=session_id)
    except Exception as e:
        db.session.rollback()
        print(f"An error occurred while updating document: {e}")

    # Record edit history
    # try:
    #     new_document_edit_history = DocumentEditor(
    #         document_id=document_id,
    #         user_id=user_id,
    #         edit_content=edit_content
    #     )
    #     db.session.add(new_document_edit_history)
    #     db.session.commit()
    # except Exception as e:
    #     db.session.rollback()
    #     print(f"An error occurred in recording document edit history: {e}")

#PROJECT ADDED TO SESSION
@socket_io.on('create_new_project_in_session')
def handle_create_new_project_in_session(user_id, session_id, title, description):
    print(f"New Project Recieved! user: {user_id}, session_id:{session_id}, title: {title}, description: {description}")
    try:
        new_project = Project(
            title=title,
            description=description,
            owner_id=user_id
        )
        db.session.add(new_project)
        db.session.commit()
        new_project_session = ProjectSession(
            project_id=new_project.id,
            session_id=session_id
        )
        db.session.add(new_project_session)
        db.session.commit()
        client_session_id = request.sid
        socket_io.emit('project_created', new_project.to_dict(), room=client_session_id)
        socket_io.emit('project_added_to_session', new_project_session.to_dict(), room=session_id)
    except Exception as e:
        db.session.rollback()
        print(e.__str__())
        print(f"An error occurred while creating your project: {e}")