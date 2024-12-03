'use client'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faBook, faBuilding, faUser, faPhone } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

export default function MajorPage({ params: paramsPromise }) {
  const [params, setParams] = useState(null)
  const [major, setMajor] = useState(null)
  //const [courses, setCourses] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await paramsPromise;
        setParams(resolvedParams);
      } catch (err) {
        setError("Failed to unwrap route parameters");
        console.error(err);
      }
    };

    unwrapParams();
  }, [paramsPromise]);


  useEffect(() => {
    if (!params?.id) return;

    const fetchMajor = async () => {
      try {
        //console.log(`${process.env.NEXT_PUBLIC_API_KEY}majors/${params.id}`)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}majors/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch major')
        const data = await response.json()
        setMajor(data)
      } catch (error) {
        console.error('Error fetching major:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMajor()



    // const fetchCourses = async () => {
    //   try {
    //     console.log(`${process.env.NEXT_PUBLIC_API_KEY}courses/?majorId=${params.id}`)
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}courses/?majorId=${params.id}`)
    //     if (!response.ok) throw new Error('Failed to fetch courses')
    //     const data = await response.json()
    //     setCourses(data)
    //   } catch (error) {
    //     console.error('Error fetching courses:', error)
    //     setError(error.message)
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    // fetchCourses()
  }, [params])

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }


  if (!major) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Major not found</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-start p-4 sm:p-8 md:p-[32px] max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <FontAwesomeIcon icon={faGraduationCap} className="text-4xl" />
          <div>
            <h1 className="text-3xl font-bold">{major.title}</h1>
            <p className="text-gray-600">{major.requiredUnits} Required Units</p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6">{major.description}</p>

        <p className="text-gray-700 mb-6">Required Units: {major.requiredUnits}</p>

        <Link 
          href={`/departments/${major.department.id}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 border rounded-lg p-[16px] border-gray-200 pb-2"
        >
            <FontAwesomeIcon icon={faBuilding} />
            <span>{major.department.name} Department</span>

            <div className="mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faUser} className="w-4" />
                <span>Department Chair: {major.department.chair || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
                <FontAwesomeIcon icon={faBuilding} className="w-4" />
                <span>Office: {major.department.officeLocation || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPhone} className="w-4" />
                <span>Contact: {major.department.phoneNumber || 'Not specified'}</span>
            </div>
            </div>
        </Link>
      </div>

      {/* Courses Section */}
      {/* it might be best to leave this section out for now */}
      {/* <div className="w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faBook} />
            Required Courses
          </h2>
          <span className="text-gray-500">
            {courses.length} Courses
          </span>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <p className="font-semibold">{course.title}</p>
              <p className="text-sm text-gray-600">{course.code}</p>
              <p className="text-sm text-gray-500">{course.units} Units</p>
              {course.isGraduateLevel && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                  Graduate Level
                </span>
              )}
            </Link>
          ))}
        </div> */}

    </div>
  )
}
