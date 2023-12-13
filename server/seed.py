#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
from datetime import datetime

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import *

fake = Faker()


# SEED USER
def seed_users():
    users = []
    #Admin
    dane_password = "danepw"
    dane = User(
        name="Dane Palazzo",
        username= "DDP",
        email= "DP@gmail.com",
        role="admin"
    )
    dane.password_hash = dane_password
    users.append(dane)
    #instructor
    stephen_password = "stephenpw"
    stephen = User(
        name="Stephen",
        username= "BigStephen",
        email= "stephen@gmail.com",
        role="instructor"
    )
    stephen.password_hash = stephen_password
    users.append(stephen)
    #Student
    chimmy_password = "chimmypw"
    stephen = User(
        name="Chimmy",
        username= "Bonesaw",
        email= "Bonesaw@gmail.com",
        role="student"
    )
    stephen.password_hash = stephen_password
    users.append(stephen)
    # for _ in range(5):
    #     name = fake.name()
    #     username = fake.user_name()
    #     email = fake.free_email()
    #     role = "student"
    #     password = username+"pw"
    #     u = User(
    #         name=name,
    #         username=username,
    #         email=email,
    #         role=role
    #     )
    #     u.password_hash = password
    #     users.append(u)
    return users

# SEED COURSE
def seed_course():
    courses = []
    title = "Python Course"
    description = "Python Course Description"
    start_date = datetime.today()
    end_date = datetime.today()
    c = Course(
        title = title,
        description = description,
        start_date = start_date,
        end_date = end_date
    )
    courses.append(c)
    return courses

# SEED SESSION
def seed_session():
    sessions = []
    title = "Python Fundimentals"
    scheduled_time = datetime.today()
    s = Session(
        title = title,
        scheduled_time = scheduled_time
    )
    sessions.append(s)
    return sessions

if __name__ == '__main__':
    with app.app_context():
        print("Starting seed...")
        # try:
        #     User.query.delete()
        # except:
        #     print("No Users")
        # try:
        #     Course.query.delete()
        # except:
        #     print("No Courses")
        # try:
        #     Session.query.delete()
        # except:
        #     print("No Sessions")
        # try:
        #     ChatMessage.query.delete()
        # except:
        #     print("No Chat Messages")


        # print("Seeding user...")
        # users = seed_users()
        # db.session.add_all(users)
        # db.session.commit()

        # print("Seeding courses...")
        # courses = seed_course()
        # db.session.add_all(courses)
        # db.session.commit()

        # print("Seeding session...")
        # session = seed_session()
        # db.session.add_all(session)
        # db.session.commit()
        print("Seed Commented Out")