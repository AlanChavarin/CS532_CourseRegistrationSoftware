'use client'
import StudentNotesSearchForm from "./StudentNotesSearchForm"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faUser } from '@fortawesome/free-solid-svg-icons'

function StudentNotes() {
  const [studentNotes, setStudentNotes] = useState([])
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
        <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
            <FontAwesomeIcon icon={faUser} />
            <h1 className="font-bold mb-4">
                Student Notes Search
            </h1>
            <FontAwesomeIcon icon={faSearch} />
        </div>
        <StudentNotesSearchForm setStudentNotes={setStudentNotes} />
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {studentNotes.map((note) => (
                <div key={note.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col gap-2">
                    <h2 className="text-xl font-semibold">{note.student?.name}</h2>
                    <p className="text-gray-600">{note.note}</p>
                    <p className="text-gray-600">{note.course_id}</p>
                    <div className="mt-auto pt-4">
                        <p className="text-sm text-gray-500">Created: {new Date(note.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
export default StudentNotes