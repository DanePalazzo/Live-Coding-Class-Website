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
    _username = db.Column("username", db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    _password_hash = db.Column(db.String(255), nullable=False)
    _email = db.Column("email", db.String(255), nullable=False, unique=True)
    role = db.Column(db.String(50))
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    last_login_date = db.Column(db.DateTime, nullable=True)

    # Relationships
    courses_taught = db.relationship('Course', back_populates='instructor')
    enrollments = db.relationship('Enrollment', back_populates='user', cascade="all, delete")
    accessible_sessions = db.relationship('SessionParticipant', back_populates='user', cascade="all, delete")
    projects = db.relationship('Project', back_populates='owner')
    project_permissions = db.relationship('ProjectEditor', back_populates='user')
    edits = db.relationship('DocumentEditHistory', back_populates='editor')
    messages = db.relationship('ChatMessage', back_populates='user')
    
    serialize_rules = (
        "-password_hash", 
        "-_password_hash", 
        "-edits", 
        "-messages",
        "-enrollments.user",
        "-accessible_sessions.user",
        "-courses_taught.instructor", 
        "-projects.owner",
        "-project_permissions.user"
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

    @property
    def username(self):
        return self._username

    @username.setter
    def username(self, username):
        self._username = username.lower()
    
    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, email):
        self._email = email.lower()
    


class Course(db.Model, SerializerMixin):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    instructor_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

    # Relationships
    instructor = db.relationship('User', back_populates='courses_taught')
    sessions = db.relationship('Session', back_populates='course', cascade="all, delete")
    enrollments = db.relationship('Enrollment', back_populates='course')

    serialize_rules = (
        '-instructor.courses_taught',
        '-instructor.enrollments',
        '-instructor.project_permissions',
        '-enrollments.user',
        '-sessions.course'
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
    participants = db.relationship('SessionParticipant', back_populates='session', cascade="all, delete")
    messages = db.relationship('ChatMessage', back_populates='session')
    projects = db.relationship('ProjectSession', back_populates='session')
    

    serialize_rules = (
        '-course.sessions',
        '-participants.session',
        '-messages.session',
        '-projects.session'
    )

class Enrollment(db.Model, SerializerMixin):
    __tablename__ = 'enrollments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id', ondelete="SET NULL"), nullable=True)
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='enrollments')
    course = db.relationship('Course', back_populates='enrollments')

    serialize_rules = (
        "-user.enrollments",
        "-course.enrollments"
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
        '-session.participants'
    )

class Project(db.Model, SerializerMixin):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, default="")
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id'), nullable=True)

    # Relationships
    owner = db.relationship('User', back_populates='projects')
    sessions = db.relationship('ProjectSession', back_populates='project')
    documents = db.relationship('Document', back_populates='project', cascade="all, delete-orphan")
    editors = db.relationship('ProjectEditor', back_populates='project', cascade="all, delete")

    serialize_rules = (
        '-owner.projects',
        '-sessions.session',
        '-documents.project',
        '-editors.project'
    )

class ProjectEditor(db.Model, SerializerMixin):
    __tablename__ = 'project_editors'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    permission_level = db.Column(db.String(50))

    # Relationships
    project = db.relationship('Project', back_populates='editors')
    user = db.relationship('User', back_populates='project_permissions')

    serialize_rules = (
        '-user',
        '-project.editors'
    )


class Document(db.Model, SerializerMixin):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    title = db.Column(db.String)
    content = db.Column(db.Text)
    verified = db.Column(db.Boolean)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime)

    # Relationships
    edits = db.relationship('DocumentEditHistory', back_populates='document', cascade="all, delete")
    project = db.relationship('Project', back_populates='documents')
    

    serialize_rules = (
        '-session',
        '-editors.document',
        '-edits.document',
        '-project.documents',
        '-project.session',
        )


class DocumentEditHistory(db.Model, SerializerMixin):
    __tablename__ = 'document_edits_history'
    id = db.Column(db.Integer, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    edit_content = db.Column(db.Text)
    edit_timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    document = db.relationship('Document', back_populates='edits')
    editor = db.relationship('User', back_populates='edits')

    serialize_rules = (
        '-editor.edits',
        '-document.edits'
    )

class ChatMessage(db.Model, SerializerMixin):
    __tablename__ = 'chat_messages'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="SET NULL"), nullable=True)
    session_id = db.Column(db.Integer, db.ForeignKey('sessions.id', ondelete="SET NULL"), nullable=True)
    message_text = db.Column(db.Text)
    edited = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship('User', back_populates='messages')
    session = db.relationship('Session', back_populates='messages')

    serialize_only = (
        'id',
        'session_id',
        'message_text',
        'edited',
        'timestamp',
        'user.username',
        'user.name'
        )
    
class ProjectSession(db.Model, SerializerMixin):
    __tablename__ = 'project_sessions'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('users.id', cascade="all, delete"), nullable=True)
    session_id = db.Column(db.Integer, db.ForeignKey('users.id', cascade="all, delete"), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    project = db.relationship('Project', back_populates='sessions')
    session = db.relationship('Session', back_populates='projects')

    serialize_only = (
        'id',
        'project_id',
        'session_id',
        'updated_at',
        'project.title',
        'project.description',
        'project.user.id',
        'project.user.username',
        'project.user.name',
        'session.title',
        'session.id',
        'session.scheduled_time',
        'session.course.title',
        'session.course.id',
        'session.participants.id',
        'session.participants.username',
        'session.participants.name',
        )

##### ADD/WORK ON FRIENDS AND DIRECT MESSAGES LATRER #####

# class Friendship(db.Model, SerializerMixin):
#     __tablename__ = 'friendships'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
#     friend_id = db.Column(db.Integer, db.ForeignKey("users.id"))

#     # Relationships
#     user = db.relationship('User', foreign_keys=[user_id], back_populates='friendships')
#     friend = db.relationship('User', foreign_keys=[friend_id], back_populates='friends')


# class DirectMessage(db.Model, SerializerMixin):
#     __tablename__ = 'direct_message'
#     id = db.Column(db.Integer, primary_key=True)
