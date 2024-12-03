'use client'
import CourseSearchForm from "./ScheduledCourseSearchForm"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBook } from '@fortawesome/free-solid-svg-icons'

function ScheduledCourses() {
  const [scheduledCourses, setScheduledCourses] = useState([])
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
        <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
            <FontAwesomeIcon icon={faBook} />
            <h1 className="font-bold mb-4">
                Scheduled Course Search
            </h1>
            <FontAwesomeIcon icon={faSearch} />
        </div>
        <CourseSearchForm setScheduledCourses={setScheduledCourses} />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {scheduledCourses.map((scheduledCourse) => (
                <div key={scheduledCourse.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">{scheduledCourse.course.name}</h2>
                    <p className="text-gray-600">{scheduledCourse.course.description}</p>
                    <div className="mt-auto pt-4">
                        <p className="text-sm text-gray-500">Instructor: {scheduledCourse.instructor.name}</p>
                        <p className="text-sm text-gray-500">Semester: {scheduledCourse.semester} {scheduledCourse.year}</p>
                        <p className="text-sm text-gray-500">Units: {scheduledCourse.course.units}</p>
                        <p className="text-sm text-gray-500">
                            {scheduledCourse.course.isGraduateLevel ? 'Graduate Level' : 'Undergraduate Level'}
                        </p>
                        <p className="text-sm text-gray-500">Description: {scheduledCourse.course.description}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
export default ScheduledCourses