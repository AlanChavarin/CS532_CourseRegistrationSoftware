'use client'
import DepartmentSearchForm from "./DepartmentSearchForm"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBuilding } from '@fortawesome/free-solid-svg-icons'

function Departments() {
  const [departments, setDepartments] = useState([])
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
        <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
            <FontAwesomeIcon icon={faBuilding} />
            <h1 className="font-bold mb-4">
                Department Search
            </h1>
            <FontAwesomeIcon icon={faSearch} />
        </div>
        <DepartmentSearchForm setDepartments={setDepartments} />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {departments.map((department) => (
                <div key={department.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">{department.name}</h2>
                    <p className="text-gray-600">Description: {department.description}</p>
                    <div className="mt-auto pt-4">
                        <p className="text-sm text-gray-500">Head Faculty: {department.headFaculty?.name || 'Not Assigned'}</p>
                        <p className="text-sm text-gray-500">
                            Number of Courses: {department.courses?.length || 0}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
export default Departments