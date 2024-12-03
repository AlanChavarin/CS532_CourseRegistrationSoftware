'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBook, faChalkboardTeacher } from "@fortawesome/free-solid-svg-icons"
import { useUser } from '../context/UserContext'  

function FacultyDashboardContent() {
  const { user } = useUser();
  const [faculty, setFaculty] = useState(null)
  const [assignedScheduledCourses, setAssignedScheduledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [department, setDepartment] = useState(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    console.log("faculty: ", faculty)
  }, [faculty])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(searchParams.get('id')) {
          const facultyRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}faculty/${searchParams.get('id')}`)
          if (!facultyRes.ok) throw new Error('Failed to fetch faculty data')
          const facultyData = await facultyRes.json()
          setFaculty(facultyData)
        } else {
          if(!user?.officeNumber) {
            setError("You are not a faculty member")
            return
          } else {
            setFaculty(user)
          }
        }

        // Ensure faculty is set before proceeding
        // Fetch assigned courses
        // const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}scheduledCourses/?instructorId=${faculty.id}`)
        // if (!coursesRes.ok) throw new Error('Failed to fetch courses')
        // const coursesData = await coursesRes.json()
        // setAssignedScheduledCourses(coursesData)

        // // Fetch department details
        // const departmentRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}departments/${faculty.mainDepartment}`)
        // if (!departmentRes.ok) throw new Error('Failed to fetch department data')
        // const departmentData = await departmentRes.json()
        // setDepartment(departmentData)

      } catch (err) {
        setError(err.message)
      } finally {
        //setLoading(false)
      }
    }

    if (user || searchParams.get('id')) {
      fetchData()
    }
  }, [user, searchParams])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}scheduledCourses/?instructorId=${faculty.id}`)
        if (!coursesRes.ok) throw new Error('Failed to fetch courses')
        const coursesData = await coursesRes.json()
        setAssignedScheduledCourses(coursesData)

        // Fetch department details
        const departmentRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}departments/${faculty.mainDepartment}`)
        if (!departmentRes.ok) throw new Error('Failed to fetch department data')
        const departmentData = await departmentRes.json()
        setDepartment(departmentData)
      } catch (err) {
        setError(err.message)   
      } finally {
        setLoading(false)
      }
    }

    if (faculty) {
      fetchData()
    }
  }, [faculty])

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

  if (!faculty) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl">Faculty member not found</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <FontAwesomeIcon icon={faChalkboardTeacher} className="text-4xl"/>
          <h1 className="text-3xl font-bold">{faculty.name}&apos;s {searchParams.get('id') ? 'Details' : 'Dashboard'}</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Faculty Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{faculty.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Faculty ID</p>
              <p className="font-medium">{faculty.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Main Department</p>
              <p className="font-medium">{faculty.mainDepartment.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{faculty.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-medium">{faculty.phoneNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Office number</p>
              <p className="font-medium">{faculty.officeNumber || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-600">Position Title</p>
              <p className="font-medium">{faculty.positionTitle}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Department Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Department Name</p>
              <p className="font-medium">{department.name}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <FontAwesomeIcon icon={faBook} className="text-2xl"/>
            <h2 className="text-xl font-semibold">Assigned Courses</h2>
          </div>
          
          { assignedScheduledCourses.length === 0 ? (
            <p className="text-gray-500">No courses assigned</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {assignedScheduledCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{course.course.title}</h3>
                  <p className="text-gray-600">Course Code: {course.course.code}</p>
                  <p className="text-gray-600">Location: {course.location}</p>
                  <p className="text-gray-600">Schedule: {course.schedule}</p>
                  <p className="text-gray-600">Semester: {course.semester}</p>
                  <p className="text-gray-600">Enrolled Students: {course.enrolledCount}</p>
                  <p className="text-gray-600">Available Seats: {course.availableSeats}</p>
                  <p className="text-gray-600">
                    Status: {course.isActive ? 
                      <span className="text-green-600">Active</span> : 
                      <span className="text-red-600">Inactive</span>
                    }
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FacultyDashboard() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    }>
      <FacultyDashboardContent />
    </Suspense>
  )
}
