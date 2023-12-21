import {React, useState, useEffect }from 'react'
import CoursesBrowserTile from '../components/CourseBrowserTile'

function CoursesBrowser({user, setUser}) {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState([])

    useEffect(() => {
        if (user) {
          setLoading(true)
          console.log(user.id)
          fetch(`/api/users/${user.id}`)
            .then(res => res.json())
            .then(user => {
              console.log(user.enrollments)
              setEnrolledCourses(user.enrollments)
            })
          fetch(`/api/courses`)
          .then(res => res.json())
          .then(courses =>
            setCourses(courses)
            )
          .finally(setLoading(false))
        }
      }, [user])

    let mappedEnrolledCoursesIds = enrolledCourses.map((enrollment)=> enrollment.course_id)

    let filteredCourses = courses.filter(course => 
      !mappedEnrolledCoursesIds.includes(course.id)
    );

    let availableCourses = filteredCourses.length > 0 
  ? filteredCourses.map((course) => <CoursesBrowserTile key={course.id} course={course} user={user} />)
  : <h3>No courses available.</h3>;

    let createNewCoursesModal = <div>
        <button className="btn btn btn-success" onClick={() => document.getElementById('create_new_course_modal').showModal()}>Create New Course</button>
        <dialog id="create_new_course_modal" className="modal">
            <div className="modal-box bg-[#111111]">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                {/* <CreateNewCourse user={user} setUser={setUser} /> */}
            </div>
        </dialog>
    </div>

    return (
        <div>
        {loading ?
          <span className="loading loading-dots loading-lg inset-1/2"></span>
          :
          <div className='flex flex-col gap-5'>
            <h2 className='text-4xl font-bold'>Courses</h2>
            {user.role === "instructor" || user.role === "admin" ? createNewCoursesModal : null}
            <div className='flex flex-row justify-evenly flex-wrap gap-2.5'>
              {availableCourses}
            </div>
          </div>
        }
      </div>
    )
}

export default CoursesBrowser