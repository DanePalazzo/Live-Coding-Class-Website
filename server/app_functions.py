from models import SessionParticipant, Enrollment, Session
from config import db

def enter_chat_room(user_id, session_id):
    participant = SessionParticipant.query.filter_by(
        user_id=user_id, session_id=session_id).first()
    if participant:
        participant.is_active = True
        db.session.commit()

def leave_chat_room(user_id, session_id):
    participant = SessionParticipant.query.filter_by(
        user_id=user_id, session_id=session_id).first()
    if participant:
        participant.is_active = False
        db.session.commit()

def enroll_user_in_course(user_id, course_id):
    # Create an enrollment record
    new_enrollment = Enrollment(user_id=user_id, course_id=course_id)
    db.session.add(new_enrollment)

    # Automatically associate the user with all sessions in the course
    course_sessions = Session.query.filter_by(course_id=course_id).all()
    for session in course_sessions:
        participant = SessionParticipant(user_id=user_id, session_id=session.id)
        db.session.add(participant)

    db.session.commit()

