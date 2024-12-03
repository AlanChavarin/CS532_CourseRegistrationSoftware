'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faUser, faCalendar, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { useUser } from '../../context/UserContext'

export default function ScheduledCoursePage() {
  const { id } = useParams()
  const { user } = useUser()
  const [scheduledCourse, setScheduledCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrollmentStatus, setEnrollmentStatus] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}scheduledCourses/${id}`)
        if (!response.ok) throw new Error('Failed to fetch course data')
        const data = await response.json()
        setScheduledCourse(data)

        if (user?.address) {
          const enrollmentRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}students/${user.id}/courses/`)
          if (enrollmentRes.ok) {
            const enrollmentData = await enrollmentRes.json()
            enrollmentData.forEach(enrollment => {
              if (enrollment.scheduledCourse.id == id) {
                setEnrollmentStatus(enrollment)
              }
            })
          }
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user])

  const handleEnroll = async () => {
    try {
      if (!user || !user.id) {
        throw new Error('User not logged in');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}students/${user.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ scheduledCourseId: parseInt(id) })
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to enroll in course');
      }

      const data = await response.json()
      setEnrollmentStatus(data)
      
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUnenroll = async () => {
    try {
      if (!user || !user.id || !enrollmentStatus) {
        throw new Error('Unable to unenroll');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}students/${user.id}/courses/${enrollmentStatus.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if(data.errorMessage){
        throw new Error(data.errorMessage)
      }

      if (!response.ok) {
        throw new Error('Failed to unenroll from course');
      }

      setEnrollmentStatus(null)
      
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    )
  }

  if (!scheduledCourse) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl">Course not found</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <FontAwesomeIcon icon={faBook} className="text-3xl"/>
            <h1 className="text-3xl font-bold">{scheduledCourse.course.title}</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Course Information</h2>
              <div className="space-y-3">
                <p className="text-gray-600">Course Code: {scheduledCourse.course.code}</p>
                <p className="text-gray-600">Units: {scheduledCourse.course.units}</p>
                <p className="text-gray-600">Level: {scheduledCourse.course.isGraduateLevel ? 'Graduate' : 'Undergraduate'}</p>
                <p className="text-gray-600">Description: {scheduledCourse.course.description}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Schedule Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-500"/>
                  <p className="text-gray-600">Instructor: {scheduledCourse.instructor.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faCalendar} className="text-gray-500"/>
                  <p className="text-gray-600">Semester: {scheduledCourse.semester} {scheduledCourse.year}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-500"/>
                  <p className="text-gray-600">Location: {scheduledCourse.location}</p>
                </div>
                <p className="text-gray-600">Schedule Number: {scheduledCourse.scheduleNumber}</p>
                <p className="text-gray-600">Available Seats: {scheduledCourse.availableSeats} / {scheduledCourse.seats}</p>
              </div>
            </div>
          </div>

          {user?.address && (
            <div className="mt-8 border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Enrollment</h2>
              {enrollmentStatus ? (
                <div>
                  <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                    <p className="text-green-700">
                      You are enrolled in this course
                      {enrollmentStatus.grade && ` (Grade: ${enrollmentStatus.grade})`}
                    </p>
                  </div>
                  <button
                    onClick={handleUnenroll}
                    className="px-6 py-2 rounded-lg text-white font-medium bg-red-600 hover:bg-red-700"
                  >
                    Unenroll from Course
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={scheduledCourse.availableSeats === 0}
                  className={`px-6 py-2 rounded-lg text-white font-medium
                    ${scheduledCourse.availableSeats === 0 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {scheduledCourse.availableSeats === 0 ? 'Course Full' : 'Enroll in Course'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
