#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, render_template, session, abort
from flask_restful import Resource
from dotenv import load_dotenv

load_dotenv()

# Local imports
from config import socket_io, app, db, api, os

# Add your model imports
from models import *

app.secret_key = os.getenv('SECRET_KEY')

#### LOGIN AUTHORIZATION ###
# @app.before_request
# def check_if_logged_in():
#     restricted_access_list = []
#     if (request.endpoint) in restricted_access_list and (not session.get('user_id')):
#         return {'error': '401 Unauthorized'}, 401


################################ SOCKETS ################################

#CONNECTION
@socket_io.on('connect')
def handle_connect():
    print('new connection')


#USER MESSAGE
@socket_io.on('user-message')
def chat_message(user_id, session_id, message_txt):
    print(f"user: {user_id}, session: {session_id}, message: {message_txt}")
    db.session.add()
    

@socket_io.on("disconnect")
def disconnected():
    print("user disconnected")


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
            print(e.__str__())
            return {"error": f"An error occurred while updating: {model.__name__}"}, 400

    def delete_item_by_id(self, model, id):
        item = model.query.filter_by(id=id).first()
        if not item:
            return {"error": f"{model.__name__} not found"}, 404
        try:
            db.session.delete(item)
            db.session.commit()
            return "", 204
        except Exception as e:
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
        pass

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
        pass

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

# Documents: GET, POST
class Documents(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=Session, rules=rules)
    
    def post(self):
        pass

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

api.add_resource(DocumentById, '/document/<int:id>')

# ChatMessages: GET, POST
class ChatMessages(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=ChatMessage, rules=rules)
    
    def post(self):
        pass

api.add_resource(ChatMessages, '/chatmessages')


# ChatMessageById: GET, PATCH, DELETE
class ChatMessageById(Resource):
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
        pass

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
        pass

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

# DocumentEditors: GET, POST
class DocumentEditors(BaseResource):
    def get(self):
        rules = None
        return self.get_items(model=DocumentEditor, rules=rules)
    
    def post(self):
        pass

api.add_resource(DocumentEditors, '/documenteditors')

# DocumentEditorById: GET, PATCH, DELETE
class DocumentEditorById(Resource):
    def get(self, id):
        rules = None
        return self.get_item_by_id(model=DocumentEditor, id=id, rules=rules)
    
    def patch(self, id):
        rules = None
        return self.patch_item_by_id(model=DocumentEditor, id=id, rules=rules)
        
    def delete(self, id):
        rules = None
        return self.delete_item_by_id(model=DocumentEditor, id=id, rules=rules)

api.add_resource(DocumentEditorById, '/documenteditors/<int:id>')

# DocumentEditHistory: GET, POST
class DocumentEditHistories(Resource):
    def get(self):
        rules = None
        return self.get_items(model=DocumentEditHistory, rules=rules)
    
    def post(self):
        pass

api.add_resource(DocumentEditHistories, '/documentedithistories')

# DocumentEditHistoryById: GET, DELETE
class DocumentEditHistoryById(Resource):
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

# CheckSession: GET

# Login: POST

# Logout: DELETE


# ERROR HANDLER
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

