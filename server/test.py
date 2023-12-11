from flask import request, render_template, session, abort
from flask_restful import Resource
from dotenv import load_dotenv
from flask_socketio import SocketIO, join_room, leave_room

load_dotenv()

# Local imports
from config import app, db, api, os

# Add your model imports
from models import *

socket_io = SocketIO(app, cors_allowed_origins="*")

app.secret_key = os.getenv('SECRET_KEY')

# Users: GET ### POST IN SIGNUP!!! ###
class Users(Resource):
    def get(self):
        users_list = [users.to_dict() for users in User.query.all()]
        return users_list, 200

api.add_resource(Users, '/users')


# UserById: GET, PATCH, DELETE
class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error": "user not found"}, 404
        return user.to_dict(), 200
    
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error": "user not found"}, 404
        try:
            data = request.get_json()
            for key in data:
                setattr(user, key, data[key])
            db.session.commit()
            return user.to_dict(), 200
        except ValueError as e:
            print(e.__str__())
            return {"errors": ["validation errors"]}, 400
        
# ENSURE USER WANTS TO DELETE ACCOUNT
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error": "user not found"}, 404
        db.session.delete(user)
        db.session.commit()

        return "", 204

api.add_resource(UserById, '/users/<int:id>')

# Courses: GET, POST
class Courses(Resource):
    def get(self):
        courses_list = [courses.to_dict() for courses in Course.query.all()]
        return courses_list, 200
    
    def post(self):
        pass

api.add_resource(Courses, '/courses')

# CourseByID: GET, PATCH, DELETE
class CourseById(Resource):
    def get(self, id):
        course = Course.query.filter_by(id=id).first()
        if not course:
            return {"error": "course not found"}, 404
        return course.to_dict(), 200

    def patch(self, id):
        course = Course.query.filter_by(id=id).first()
        if not course:
            return {"error": "course not found"}, 404
        try:
            data = request.get_json()
            for key in data:
                setattr(course, key, data[key])
            db.session.commit()
            return course.to_dict(), 200
        except ValueError as e:
            print(e.__str__())
            return {"errors": ["validation errors"]}, 400

    def delete(self, id):
        course = Course.query.filter_by(id=id).first()
        if not course:
            return {"error": "course not found"}, 404
        db.session.delete(course)
        db.session.commit()

        return "", 204

api.add_resource(CourseById, '/courses/<int:id>')

# Sessions: GET, POST
class Sessions(Resource):
    def get(self):
        sessions_list = [sessions.to_dict() for sessions in Session.query.all()]
        return sessions_list, 200
    
    def post(self):
        pass

api.add_resource(Sessions, '/sessions')

# SessionById: GET, PATCH, DELETE
class SessionById(Resource):
    def get(self, id):
        csession = Session.query.filter_by(id=id).first()
        if not csession:
            return {"error": "csession not found"}, 404
        return csession.to_dict(), 200
    
    def patch(self, id):
        csession = Session.query.filter_by(id=id).first()
        if not csession:
            return {"error": "csession not found"}, 404
        try:
            data = request.get_json()
            for key in data:
                setattr(csession, key, data[key])
            db.session.commit()
            return csession.to_dict(), 200
        except ValueError as e:
            print(e.__str__())
            return {"errors": ["validation errors"]}, 400

    def delete(self, id):
        csession = Session.query.filter_by(id=id).first()
        if not csession:
            return {"error": "csession not found"}, 404
        db.session.delete(csession)
        db.session.commit()

        return "", 204

api.add_resource(SessionById, '/sessions/<int:id>')

# Documents: GET, POST
class Documents(Resource):
    def get(self):
        document_list = [document.to_dict() for document in Document.query.all()]
        return document_list, 200
    
    def post(self):
        pass

api.add_resource(Documents, '/documents')

# DocumentById: GET, PATCH, DELETE
class DocumentById(Resource):
    def get(self, id):
        document = Document.query.filter_by(id=id).first()
        if not document:
            return {"error": "document not found"}, 404
        return document.to_dict(), 200
    
    def patch(self, id):
        document = Document.query.filter_by(id=id).first()
        if not document:
            return {"error": "document not found"}, 404
        try:
            data = request.get_json()
            for key in data:
                setattr(document, key, data[key])
            db.session.commit()
            return document.to_dict(), 200
        except ValueError as e:
            print(e.__str__())
            return {"errors": ["validation errors"]}, 400

    def delete(self, id):
        document = Document.query.filter_by(id=id).first()
        if not document:
            return {"error": "document not found"}, 404
        db.session.delete(document)
        db.session.commit()

        return "", 204

api.add_resource(DocumentById, '/document/<int:id>')

# ChatMessages: GET, POST
class ChatMessages(Resource):
    def get(self):
        chat_message_list = [chat_message.to_dict() for chat_message in ChatMessage.query.all()]
        return chat_message_list, 200
    
    def post(self):
        pass

api.add_resource(ChatMessages, '/chatmessages')

# ChatMessageById: GET, PATCH, DELETE
class ChatMessageById(Resource):
    def get(self, id):
        chat_message = ChatMessage.query.filter_by(id=id).first()
        if not chat_message:
            return {"error": "chat_message not found"}, 404
        return chat_message.to_dict(), 200
    
    def patch(self, id):
        chat_message = ChatMessage.query.filter_by(id=id).first()
        if not chat_message:
            return {"error": "chat_message not found"}, 404
        try:
            data = request.get_json()
            for key in data:
                setattr(chat_message, key, data[key])
            db.session.commit()
            return chat_message.to_dict(), 200
        except ValueError as e:
            print(e.__str__())
            return {"errors": ["validation errors"]}, 400

    def delete(self, id):
        chat_message = ChatMessage.query.filter_by(id=id).first()
        if not chat_message:
            return {"error": "chat_message not found"}, 404
        db.session.delete(chat_message)
        db.session.commit()

        return "", 204

api.add_resource(ChatMessageById, '/chatmessages/<int:id>')

##### JOIN TABLES ROUTES #####

# Enrollments: GET, POST
class Enrollments(Resource):
    def get(self):
        enrollment_list = [enrollment.to_dict() for enrollment in Enrollment.query.all()]
        return enrollment_list, 200
    
    def post(self):
        pass

api.add_resource(Enrollments, '/enrollments')

# EnrollmentById: GET, DELETE
class EnrollmentById(Resource):
    def get(self, id):
        enrollment = Enrollment.query.filter_by(id=id).first()
        if not enrollment:
            return {"error": "enrollment not found"}, 404
        return enrollment.to_dict(), 200

    def delete(self, id):
        enrollment = Enrollment.query.filter_by(id=id).first()
        if not enrollment:
            return {"error": "enrollment not found"}, 404
        db.session.delete(enrollment)
        db.session.commit()

        return "", 204

api.add_resource(EnrollmentById, '/enrollments/<int:id>')


# SessionParticipants: GET, POST
class SessionParticipants(Resource):
    def get(self):
        sesssion_participant_list = [session_participant.to_dict() for session_participant in SessionParticipant.query.all()]
        return sesssion_participant_list, 200
    
    def post(self):
        pass

api.add_resource(SessionParticipants, '/SessionParticipants')

# SessionParticipant: GET, PATCH, DELETE
class SessionParticipantById(Resource):
    def get(self, id):
        session_participant = SessionParticipant.query.filter_by(id=id).first()
        if not session_participant:
            return {"error": "session_participant not found"}, 404
        return session_participant.to_dict(), 200
    
    def patch(self, id):
        session_participant = SessionParticipant.query.filter_by(id=id).first()
        if not session_participant:
            return {"error": "session_participant not found"}, 404
        try:
            data = request.get_json()
            for key in data:
                setattr(session_participant, key, data[key])
            db.session.commit()
            return session_participant.to_dict(), 200
        except ValueError as e:
            print(e.__str__())
            return {"errors": ["validation errors"]}, 400

    def delete(self, id):
        session_participant = SessionParticipant.query.filter_by(id=id).first()
        if not session_participant:
            return {"error": "session_participant not found"}, 404
        db.session.delete(session_participant)
        db.session.commit()

        return "", 204

api.add_resource(SessionParticipantById, '/SessionParticipants/<int:id>')

# DocumentEditors: GET, POST
class DocumentEditors(Resource):
    def get(self):
        document_editor_list = [document_editor.to_dict() for document_editor in DocumentEditor.query.all()]
        return document_editor_list, 200
    
    def post(self):
        pass

api.add_resource(DocumentEditors, '/documenteditors')

# DocumentEditorById: GET, PATCH, DELETE
class DocumentEditorById(Resource):
    def get(self, id):
        document_editor = DocumentEditor.query.filter_by(id=id).first()
        if not document_editor:
            return {"error": "document_editor not found"}, 404
        return document_editor.to_dict(), 200
    
    def patch(self, id):
        document_editor = DocumentEditor.query.filter_by(id=id).first()
        if not document_editor:
            return {"error": "document_editor not found"}, 404
        try:
            data = request.get_json()
            for key in data:
                setattr(document_editor, key, data[key])
            db.session.commit()
            return document_editor.to_dict(), 200
        except ValueError as e:
            print(e.__str__())
            return {"errors": ["validation errors"]}, 400

    def delete(self, id):
        document_editor = DocumentEditor.query.filter_by(id=id).first()
        if not document_editor:
            return {"error": "document_editor not found"}, 404
        db.session.delete(document_editor)
        db.session.commit()

        return "", 204

api.add_resource(DocumentEditorById, '/documenteditors/<int:id>')

# DocumentEditHistory: GET, POST
class DocumentEditHistories(Resource):
    def get(self):
        document_edit_history_list = [document_edit_history.to_dict() for document_edit_history in DocumentEditHistory.query.all()]
        return document_edit_history_list, 200
    
    def post(self):
        pass

api.add_resource(DocumentEditHistories, '/documentedithistories')

# DocumentEditHistoryById: GET, DELETE
class DocumentEditHistoryById(Resource):
    def get(self, id):
        document_edit_history = DocumentEditHistory.query.filter_by(id=id).first()
        if not document_edit_history:
            return {"error": "document_edit_history not found"}, 404
        return document_edit_history.to_dict(), 200

# ENSURE USER WANTS TO DELETE DOCUMENT HISTORY
    def delete(self, id):
        document_edit_history = DocumentEditHistory.query.filter_by(id=id).first()
        if not document_edit_history:
            return {"error": "document_edit_history not found"}, 404
        db.session.delete(document_edit_history)
        db.session.commit()

        return "", 204

api.add_resource(DocumentEditHistoryById, '/documentedithistories/<int:id>')


##### AUTH ROUTES #####

# UserSignUp: POST

# CheckSession: GET

# Login: POST

# Logout: DELETE






############ POST BASERESOURCE TEST #################

class BaseResource(Resource):
    # ... other methods ...

    def post_item(self, model, allowed_fields, rules=None):
        data = request.get_json()
        try:
            # Prepare the data for the new item
            item_data = {field: data[field] for field in allowed_fields if field in data}

            # Create a new instance of the model
            new_item = model(**item_data)
            db.session.add(new_item)
            db.session.commit()

            # Assuming your model has a to_dict() method that accepts rules
            return new_item.to_dict(rules=rules) if rules else new_item.to_dict(), 201

        except Exception as e:
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400