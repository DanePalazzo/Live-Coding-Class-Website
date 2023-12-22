#!/usr/bin/env python3

# IMPORTS
from flask import request, render_template, session, abort
from flask_restful import Resource
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError
import traceback

load_dotenv()

# Local imports
from config import socket_io, app, db, api, os

# Add your model imports
from models import *

app.secret_key = os.getenv('SECRET_KEY')

#### LOGIN AUTHORIZATION ###
@app.before_request
def check_if_logged_in():
    restricted_access_list = []
    if (request.endpoint) in restricted_access_list and (not session.get('user_id')):
        return {'error': '401 Unauthorized'}, 401


################################ SOCKETS ################################
import socket_handlers

################################ APP FUNCTIONS ################################
# import app_functions

################################ ROUTES ################################

##### BaseResource #####
class BaseResource(Resource):
    def get_items(self, model, rules=None):
        item_list = [items.to_dict(rules=rules) for items in model.query.all()]
        return item_list, 200
    
    def get_item_by_id(self, model, id, rules=None):
        item = model.query.filter_by(id=id).first()
        if not item:
            return {"error": f"{model.__name__} not found"}, 404
        return item.to_dict(rules=rules), 200
    
    def patch_item_by_id(self, model, id, rules=None):
        item = model.query.filter_by(id=id).first()
        if not item:
            return {"error": f"{model.__name__} not found"}, 404
        try:
            data = request.get_json()
            for key in data:
                if hasattr(item, key):
                    setattr(item, key, data[key])
            db.session.commit()
            return item.to_dict(rules=rules), 200
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while updating: {model.__name__}"}, 400

    def delete_item_by_id(self, model, id, rules=None):
        item = model.query.filter_by(id=id).first()
        if not item:
            return {"error": f"{model.__name__} not found"}, 404
        try:
            db.session.delete(item)
            db.session.commit()
            return "", 204
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while deleting: {model.__name__}"}, 400
    
##### BASIC ROUTES #####
# Users: GET
class Users(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=User, rules=rules)

api.add_resource(Users, '/users')

# UserById: GET, PATCH, DELETE
class UserById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=User, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=User, id=id, rules=rules)
        
# ENSURE USER WANTS TO DELETE ACCOUNT
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=User, id=id, rules=rules)

api.add_resource(UserById, '/users/<int:id>')

# Courses: GET, POST
class Courses(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=Course, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_course = Course(
                title = data["title"],
                description = data["description"],
                instructor_id = data["instructor_id"],
                start_date = data["start_date"],
                end_date = data["end_date"]
            )
            db.session.add(new_course)
            db.session.commit()
            return new_course.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(Courses, '/courses')

# CourseByID: GET, PATCH, DELETE
class CourseById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=Course, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=Course, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=Course, id=id, rules=rules)

api.add_resource(CourseById, '/courses/<int:id>')

# Sessions: GET, POST
class Sessions(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=Session, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_session = Session(
                course_id = data["course_id"],
                title = data["title"]
            )
            db.session.add(new_session)
            db.session.commit()
            return new_session.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(Sessions, '/sessions')


# SessionById: GET, PATCH, DELETE
class SessionById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=Session, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=Session, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=Session, id=id, rules=rules)

api.add_resource(SessionById, '/sessions/<int:id>')

# Projects: GET, POST
class Projects(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=Project, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_project = Project(
                title=data["title"],
                description=data["description"],
                owner_id=data["owner_id"]
            )
            db.session.add(new_project)
            db.session.commit()
            return new_project.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(Projects, '/projects')

# ProjectById: GET, PATCH, DELETE
class ProjectById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=Project, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=Project, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=Project, id=id, rules=rules)

api.add_resource(ProjectById, '/projects/<int:id>')

# Documents: GET, POST
class Documents(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=Document, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_document = Document(
                project_id = data["project_id"],
                title = data["title"],
                language = data["language"],
                content = data["content"]
            )
            db.session.add(new_document)
            db.session.commit()
            return new_document.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(Documents, '/documents')

# DocumentById: GET, PATCH, DELETE
class DocumentById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=Document, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=Document, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=Document, id=id, rules=rules)

api.add_resource(DocumentById, '/documents/<int:id>')

# ChatMessages: GET, POST
class ChatMessages(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=ChatMessage, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_chat_message = ChatMessage(
                user_id = data["user_id"],
                session_id = data["session_id"],
                message_text = data["message_text"]
            )
            db.session.add(new_chat_message)
            db.session.commit()
            return new_chat_message.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(ChatMessages, '/chatmessages')

# ChatMessageById: GET, PATCH, DELETE
class ChatMessageById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=ChatMessage, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=ChatMessage, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=ChatMessage, id=id, rules=rules)

api.add_resource(ChatMessageById, '/chatmessages/<int:id>')

##### JOIN TABLES ROUTES #####

# Enrollments: GET, POST
class Enrollments(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=Enrollment, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_enrollment = Enrollment(
                user_id = data["user_id"],
                course_id = data["course_id"]
            )
            db.session.add(new_enrollment)
            db.session.flush() # Flush the session to populate new_enrollment with related objects
            if new_enrollment.course and new_enrollment.course.sessions:
                rel_sessions_ids = [session.id for session in new_enrollment.course.sessions]
                for rel_sessions_id in rel_sessions_ids:
                    new_session_participant = SessionParticipant(
                        user_id = data["user_id"],
                        session_id = rel_sessions_id
                    )
                    db.session.add(new_session_participant)
                db.session.commit()
            return new_enrollment.to_dict(rules=None), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            print("Error:", e, "\nTraceback:", traceback.format_exc())
            return {"error": f"An error occurred while posting your message"}, 400


api.add_resource(Enrollments, '/enrollments')

# EnrollmentById: GET, DELETE
class EnrollmentById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=Enrollment, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=Enrollment, id=id, rules=rules)

api.add_resource(EnrollmentById, '/enrollments/<int:id>')

# SessionParticipants: GET, POST
class SessionParticipants(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=SessionParticipant, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_session_participant = SessionParticipant(
                session_id = data["session_id"],
                user_id = data["user_id"]
            )
            db.session.add(new_session_participant)
            db.session.commit()
            return new_session_participant.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(SessionParticipants, '/sessionparticipants')

# SessionParticipant: GET, PATCH, DELETE
class SessionParticipantById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=SessionParticipant, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=SessionParticipant, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=SessionParticipant, id=id, rules=rules)

api.add_resource(SessionParticipantById, '/sessionparticipants/<int:id>')

# ProjectEditors: GET, POST
class ProjectEditors(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=ProjectEditor, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_project = ProjectEditor(
                project_id=data["project_id"],
                user_id=data["user_id"],
                permission_level = data["permission_level"]
            )
            db.session.add(new_project)
            db.session.commit()
            return new_project.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(ProjectEditors, '/projecteditors')

# ProjectEditorsById: GET, PATCH, DELETE
class ProjectEditorById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=ProjectEditor, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=ProjectEditor, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=ProjectEditor, id=id, rules=rules)

api.add_resource(ProjectEditorById, '/projecteditors/<int:id>')

# ProjectSessions: GET, POST
class ProjectSessions(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=ProjectSession, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_project_session = ProjectSession(
                project_id=data["project_id"],
                session_id=data["session_id"]
            )
            db.session.add(new_project_session)
            db.session.commit()
            return new_project_session.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(ProjectSessions, '/projectsessions')

# ProjectSessionById: GET, PATCH, DELETE
class ProjectSessionById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=ProjectSession, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=ProjectSession, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=ProjectSession, id=id, rules=rules)

api.add_resource(ProjectSessionById, '/projectsessions/<int:id>')

# DocumentEditHistory: GET, POST
class DocumentEditHistories(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=DocumentEditHistory, rules=rules)
    
    def post(self):
        data = request.get_json()
        try:
            new_document_edit_history = DocumentEditHistory(
                document_id = data["document_id"],
                user_id = data["user_id"],
                edit_content = data["edit_content"]
            )
            db.session.add(new_document_edit_history)
            db.session.commit()
            return new_document_edit_history.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            print(e.__str__())
            return {"error": f"An error occurred while posting your message"}, 400

api.add_resource(DocumentEditHistories, '/documentedithistories')

# DocumentEditHistoryById: GET, DELETE
class DocumentEditHistoryById(BaseResource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=DocumentEditHistory, id=id, rules=rules)

# ENSURE USER WANTS TO DELETE DOCUMENT HISTORY  
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=DocumentEditHistory, id=id, rules=rules)

api.add_resource(DocumentEditHistoryById, '/documentedithistories/<int:id>')

##### AUTH ROUTES #####
# UserSignUp: POST
class UserSignUp(BaseResource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        try:
            new_user = User(
                username = username,
                name = name,
                email = email,
                role = role
                )
            try:
                print("Trying hash")
                new_user.password_hash = password
                print("Adding user to session...")
                db.session.add(new_user)
                print("Commiting session...")
                print(new_user)
                db.session.commit()

                session['user_id'] = new_user.id

                return new_user.to_dict(), 201
            except IntegrityError:
                return {'error': '422 Unprocessable Entity'}, 422
        except ValueError as e:
            print(e.__str__())
            return {"errors": ["validation errors"]}, 400

api.add_resource(UserSignUp, "/signup")

# CheckSession: GET
class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return user.to_dict(), 200
        
        return {}, 401

api.add_resource(CheckSession, "/checksession")

# Login: POST
class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if email:
            email_lower = email.lower()
            user = User.query.filter(User._email == email_lower).first()
        if username:
            username_lower = username.lower()
            user = User.query.filter(User._username == username_lower).first()
        if user and user.authenticate(password):
            session['user_id'] = user.id
            return user.to_dict(), 201
        
        return {'error': '401 Unauthorized'}, 401

api.add_resource(Login, "/login")

# Logout: DELETE
class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204

api.add_resource(Logout, "/logout")

# ERROR HANDLER
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

if __name__ == '__main__':
    # app.run(port=5555, debug=True)
    socket_io.run(app, port=5555)


