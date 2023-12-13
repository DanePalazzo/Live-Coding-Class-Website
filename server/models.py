from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import Bcrypt
from sqlalchemy import MetaData

bcrypt = Bcrypt()

from config import db, metadata

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    _password_hash = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50))
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_login_date = db.Column(db.DateTime, nullable=True)

    # Relationships
    courses_taught = db.relationship('Course', back_populates='instructor')
    enrollments = db.relationship('Enrollment', back_populates='user')
    accessible_sessions = db.relationship('SessionParticipant', back_populates='user')
    documents = db.relationship('Document', back_populates='owner')
    editor_permissions = db.relationship('DocumentEditor', back_populates='user')
    edits = db.relationship('DocumentEditHistory', back_populates='editor')
    messages = db.relationship('ChatMessage', back_populates='user')
    
    serialize_rules = (
        "-password_hash", 
        "-_password_hash", 
        "-edits", 
        "-messages",
        "-enrollments.user", 
        "-accessible_sessions", 
        "-courses_taught.enrollments", 
        "-courses_taught.instructor", 
        "-enrollments.course.instructor", 
        "-enrollments.course.enrollments"
        )

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    


class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

    # Relationships
    instructor = db.relationship('User', back_populates='courses_taught')
    sessions = db.relationship('Session', back_populates='course')
    enrollments = db.relationship('Enrollment', back_populates='course')

    serialize_rules = (
        '-sessions.course',
        '-sessions.documents',
        '-sessions.messages',
        '-sessions.participants',
        '-enrollments.course',
        '-enrollments.user.documents',
        '-enrollments.user.editor_permissions',
        '-enrollments.user.courses_taught',
        '-enrollments.user.last_login_date',
        '-instructor.courses_taught',
        '-instructor.enrollments',
        '-instructor.documents',
        '-instructor.editor_permissions',
        '-instructor.last_login_date',
        '-instructor.registration_date'
        )

class Session(db.Model, SerializerMixin):
    __tablename__ = 'sessions'
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)
    title = db.Column(db.String(255), nullable=False)
    scheduled_time = db.Column(db.DateTime, nullable=True)
    duration = db.Column(db.String, nullable=True)

    # Relationships
    course = db.relationship('Course', back_populates='sessions')
    participants = db.relationship('SessionParticipant', back_populates='session')
    documents = db.relationship('Document', back_populates='session')
    messages = db.relationship('ChatMessage', back_populates='session')

    serialize_rules = (
        '-course.sessions', 
        '-participants.session', 
        '-documents.session', 
        '-messages.session',
        '-course.instructor.editor_permissions',
        '-course.instructor.documents',
        '-course.instructor.enrollments',
        '-course.instructor.last_login_date',
        '-course.instructor.registration_date',
        '-course.enrollments'
        )

class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'))
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='enrollments')
    course = db.relationship('Course', back_populates='enrollments')

    serialize_rules = (
        "-user.enrollments", 
        "-user.documents",
        "-user.editor_permissions",
        "-user.courses_taught"
        )

class SessionParticipant(db.Model, SerializerMixin):
    __tablename__ = 'session_participants'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    is_active = db.Column(db.Boolean, default=False)

    # Relationships
    session = db.relationship('Session', back_populates='participants')
    user = db.relationship('User', back_populates='accessible_sessions')

    serialize_rules = (
        '-user.accessible_sessions', 
        '-session.participants',
        '-session.documents',
        '-session.messages',
        '-user.courses_taught',
        '-user.enrollments',
        '-user.editor_permissions',
        '-user.documents'
        )

class Document(db.Model, SerializerMixin):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String)
    content = db.Column(db.Text)
    verified = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Relationships
    session = db.relationship('Session', back_populates='documents')
    owner = db.relationship('User', back_populates='documents')
    editors = db.relationship('DocumentEditor', back_populates='document')
    edits = db.relationship('DocumentEditHistory', back_populates='document')

    serialize_rules = (
        '-owner',
        '-session',
        '-editors.document', 
        '-edits.document'
        )

class DocumentEditor(db.Model, SerializerMixin):
    __tablename__ = 'document_editors'
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    permission_level = db.Column(db.String(50))

    # Relationships
    document = db.relationship('Document', back_populates='editors')
    user = db.relationship('User', back_populates='editor_permissions')

    serialize_rules = (
        '-user',
        '-document.editors',
        '-document.edits'
        )

class DocumentEditHistory(db.Model, SerializerMixin):
    __tablename__ = 'document_edits_history'
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    edit_content = db.Column(db.Text)
    edit_timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    document = db.relationship('Document', back_populates='edits')
    editor = db.relationship('User', back_populates='edits')

    serialize_rules = (
        '-editor',
        '-document.editors',
        '-document.content',
        '-document.edits'
        )

class ChatMessage(db.Model, SerializerMixin):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'))
    message_text = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='messages')
    session = db.relationship('Session', back_populates='messages')

    serialize_rules = (
        '-user',
        '-session'
        )