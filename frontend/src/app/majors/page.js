'use client'
import MajorSearchForm from "./MajorSearchForm"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faGraduationCap, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

function Majors() {
  const [majors, setMajors] = useState([])
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
        <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
            <FontAwesomeIcon icon={faGraduationCap} />
            <h1 className="font-bold mb-4">
                Major Search
            </h1>
            <FontAwesomeIcon icon={faSearch} />
        </div>
        <MajorSearchForm setMajors={setMajors} />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {majors.map((major) => (
                <Link key={major.id} href={`/majors/${major.id}`} className="group bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col gap-2 hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <p className="text-gray-600">Description: {major.description}</p>
                    <div className="mt-auto pt-4">
                        <p className="text-sm text-gray-500">Department: {major.department.name}</p>
                        <p className="text-sm text-gray-500">
                            Required Credits: {major.requiredCredits}
                        </p>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <h2 className="text-xl font-semibold">{major.title}</h2>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                </Link>
            ))}
        </div>
    </div>
  )
}
export default Majors