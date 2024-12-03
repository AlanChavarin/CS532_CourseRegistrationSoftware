'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faGraduationCap } from "@fortawesome/free-solid-svg-icons"

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const searchParams = useSearchParams()
  const studentId = searchParams.get('id')

  useEffect(() => {
    console.log("Student: ", student)
  }, [student])

  useEffect(() => {
    console.log("enrolledCourses: ", enrolledCourses)
  }, [enrolledCourses])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details
        const studentRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}students/${studentId}`)
        if (!studentRes.ok) throw new Error('Failed to fetch student data')
        const studentData = await studentRes.json()
        setStudent(studentData)

        // Fetch enrolled courses
        const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}students/${studentId}/courses`)
        if (!coursesRes.ok) throw new Error('Failed to fetch courses')
        const coursesData = await coursesRes.json()
        setEnrolledCourses(coursesData)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      fetchData()
    }
  }, [studentId])


  if(!studentId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl">No student ID provided</div>
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            const id = e.target.studentId.value
            window.location.href = `/studentDashboard?id=${id}`
          }}
          className="flex flex-col items-center gap-4 mt-4"
        >
          <input
            type="number" 
            name="studentId"
            placeholder="Enter Student ID"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            View Dashboard
          </button>
        </form>
      </div>
    )
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

  if (!student) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl">Student not found</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <FontAwesomeIcon icon={faGraduationCap} className="text-4xl"/>
          <h1 className="text-3xl font-bold">{student.name}'s Dashboard</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{student.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Student ID</p>
              <p className="font-medium">{student.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Date of Birth</p>
              <p className="font-medium">{student.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-gray-600">Address</p>
              <p className="font-medium">{student.address}</p>
            </div>
            <div>
              <p className="text-gray-600">Major</p>
              <p className="font-medium">{student.major?.title || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-600">Minor</p>
              <p className="font-medium">{student.minor?.title || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-600">GPA</p>
              <p className="font-medium">{student.GPA || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <FontAwesomeIcon icon={faBook} className="text-2xl"/>
            <h2 className="text-xl font-semibold">Enrolled Courses</h2>
          </div>
          
          {enrolledCourses.length === 0 ? (
            <p className="text-gray-500">No courses enrolled</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {enrolledCourses.map((enrollment) => (
                <div key={enrollment.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{enrollment.scheduledCourse.course.title}</h3>
                  <p className="text-gray-600">Course Code: {enrollment.scheduledCourse.course.code}</p>
                  <p className="text-gray-600">Location: {enrollment.scheduledCourse.location}</p>
                  <p className="text-gray-600">Enrollment Date: {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                  <p className="text-gray-600">
                    Status: {enrollment.isCompleted ? 
                      <span className="text-green-600">Completed</span> : 
                      <span className="text-blue-600">In Progress</span>
                    }
                  </p>
                  <p className="text-gray-600">Instructor: {enrollment.scheduledCourse.instructor.name}</p>
                  <p className="text-gray-600">Semester: {enrollment.scheduledCourse.semester}</p>

                  {enrollment.grade && (
                    <p className="text-gray-600">Grade: {enrollment.grade}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>

  )
}
