'use client'
import StudentSearchForm from "./StudentSearchForm"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons'

function Students() {
  const [students, setStudents] = useState([])
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
        <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
            <FontAwesomeIcon icon={faUser} />
            <h1 className="font-bold mb-4">
                Student Search
            </h1>
            <FontAwesomeIcon icon={faSearch} />
        </div>
        <StudentSearchForm setStudents={setStudents} />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {students.map((student) => (
                <div key={student.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">{student.name}</h2>
                    <p className="text-gray-600">GPA: {student.gpa || 'Not Available'}</p>
                    <div className="mt-auto pt-4">
                        <p className="text-sm text-gray-500">Major: {student.major?.title || 'Not Available'}</p>
                        <p className="text-sm text-gray-500">
                            Address: {student.address || 'Not Available'}
                        </p>
                        <p className="text-sm text-gray-500">Minor: {student.minor?.title || 'Not Available'}</p>
                        <p className="text-sm text-gray-500">Date of Birth: {student.dateOfBirth || 'Not Available'}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
export default Students