from config import socket_io
from app import *

#CONNECTION
@socket_io.on('connect')
def handle_connect():
    print('new connection')
    
#DISCONNECT
@socket_io.on("disconnect")
def handle_disconnected():
    print("user disconnected")

#USER MESSAGE
@socket_io.on('user_chat')
def chat_message(user_id, session_id, message_txt):
    print(f"user: {user_id}, session: {session_id}, message: {message_txt}")
    new_chat_message = ChatMessage()
    db.session.add()

#DOCUMENT UPDATE
@socket_io.on('document_update')
def document_update(user_id, session_id, update):
    print(f"user: {user_id}, session: {session_id}, update: {update}")