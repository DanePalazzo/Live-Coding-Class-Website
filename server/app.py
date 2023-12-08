#!/usr/bin/env python3

# Standard library imports

# Remote library imports
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

@app.before_request
def check_if_logged_in():
    restricted_access_list = []
    if (request.endpoint) in restricted_access_list and (not session.get('user_id')):
        return {'error': '401 Unauthorized'}, 401

@socket_io.on('connect')
def handle_connect():
    print('new connection')

# @socket_io.on("message")
# def handle_message(data):
#     print("recived message" + data)


@socket_io.on('client-message')
def chat_message(name, message, roomNum):
    print(message)
    socket_io.emit('server-message', {
        'sender': name,
        'message': message
        }, room = roomNum)
    
@socket_io.on('room-change')
def change_room(room):
    if room == "1":
        leave_room("2")
        join_room(room)
    else:
        leave_room("1")
        join_room(room)

@socket_io.on("disconnect")
def disconnected():
    """event listener when client disconnects to the server"""
    print("user disconnected")

class Users(Resource):
    def get(self):
        users_list = [users.to_dict() for users in User.query.all()]
        return users_list, 200
    
api.add_resource(Users, '/users')

class UserById(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error": "Customer not found"}, 404
        return user.to_dict(), 200
    
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return {"error": "Customer not found"}, 404
        db.session.delete(user)
        db.session.commit()

        return "", 204

# Views go here! use either route!
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

