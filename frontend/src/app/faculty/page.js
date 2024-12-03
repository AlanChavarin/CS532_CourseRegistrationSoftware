'use client'
import FacultySearchForm from "./FacultySearchForm"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

function Faculty() {
  const [faculty, setFaculty] = useState([])
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
        <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
            <FontAwesomeIcon icon={faUser} />
            <h1 className="font-bold mb-4">
                Faculty Search
            </h1>
            <FontAwesomeIcon icon={faSearch} />
        </div>
        <FacultySearchForm setFaculty={setFaculty} />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {faculty.map((facultyMember) => (
                <Link href={`/facultyDashboard/?id=${facultyMember.id}`} key={facultyMember.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col gap-2 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <h2 className="text-xl font-semibold">{facultyMember.name}</h2>
                    <p className="text-gray-600">Position: {facultyMember.positionTitle}</p>
                    <p className="text-gray-600">Main Department: {facultyMember.mainDepartment?.name || 'Not Available'}</p>
                    <div className="mt-auto pt-4">
                        <p className="text-sm text-gray-500">
                            Phone Number: {facultyMember.phoneNumber || 'Not Available'}
                        </p>
                        <p className="text-sm text-gray-500">
                            Office Number: {facultyMember.officeNumber || 'Not Available'}
                        </p>
                    </div>

                    <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                </Link>
            ))}
        </div>
    </div>
  )
}
export default Faculty