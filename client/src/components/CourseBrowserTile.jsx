import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CoursesBrowserTile({user, course}) {
    const [courseTitle, setCourseTitle] = useState("")
    const [courseDescription, setCourseDescription] = useState("")
    const [courseInstructor, setCourseInstructor] = useState(null)
    const [courseSessions, setCourseSessions] = useState([])

    const navigate = useNavigate()

    // Renders the title and description when the element loads in a useEffect to prevent loops
    useEffect(() => {
        setCourseTitle(course.title)
        setCourseDescription(course.description)
        if (course.instructor) {
            setCourseInstructor(course.instructor);
        }
        setCourseSessions(course.sessions)
    }, [])

    console.log(course)

    //ENROLL IN COURSE USING COURSE_ID AND USER_ID (AUTO ENROLLS IN SESSIONS)
    function handleEnrollInCourse(){
        new_enrollment = {
            "user_id": user.id,
            "course_id": course.id
        }
        fetch('/api/enrollments', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(new_enrollment)
        })
        .then(res => res.json())
        .then(enrollment => {
            fetch("/api/checksession").then((response) => {
                if (response.ok) {
                  response.json().then((user) => {setUser(user); document.getElementById('enroll_course_modal').close()});
                }
              });
            })
    }


    let mappedCourseSessions = courseSessions.map((course)=> <p className="text-sm">{course.title}</p>)

    let enrollCourseModal =
        <div>
            <button className="btn btn-sm btn-outline btn-error" onClick={() => document.getElementById('enroll_course_modal').showModal()}>REMOVE</button>
            <dialog id="enroll_course_modal" className="modal">
                <div className="modal-box bg-[#111111]">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">Enrollment: {courseTitle}</h3>
                    <p className="py-4">{courseDescription}</p>
                    {courseInstructor && <div className='flex flex-col justify-center'>
                        <p className="py-4">{courseInstructor.name}</p>
                        <p className="py-4">{courseInstructor._email}</p>
                    </div>}
                    <div>
                        <button className="btn btn-outline btn-success" onClick={(e) => handleEnrollInCourse(e)}>ENROLL IN: {courseTitle}</button>
                    </div>
                </div>
            </dialog>
        </div>

    return (
        <div className="card w-200 bg-[#111111] shadow-xl">
            <div className="card-body">
                <div className="grid grid-cols-2 gap-2">
                    <div class="flex flex-col">
                        <div className='flex flex-row justify-between'>
                            <h2 className="card-title">{courseTitle}</h2>
                        </div>
                        <p className='text-left'>{courseDescription}</p>
                        {courseInstructor?
                        <div className='flex flex-col justify-between text-left'>
                                <p className="font-bold text-sm">Course Instructor:</p>
                                <p className="text-sm">{courseInstructor.name}</p>
                                <p className="text-sm">{courseInstructor._email}</p>
                        </div>
                        : null}
                    </div>
                    {mappedCourseSessions.length !== 0 &&<div className='flex flex-col justify-between text-right'>
                            <p className="font-bold">Sessions:</p>
                            {mappedCourseSessions}
                    </div>}
                </div>
                <div className="card-actions justify-end">
                    <button className="btn btn-outline btn-block btn-accent" onClick={enrollCourseModal}>Enroll?</button>
                </div>
            </div>
        </div>
    )
}

export default CoursesBrowserTile