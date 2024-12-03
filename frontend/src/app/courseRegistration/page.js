'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CourseRegistration() {
    const [students, setStudents] = useState([])
    const [scheduledCourses, setScheduledCourses] = useState([])
    const [selectedStudent, setSelectedStudent] = useState('')
    const [selectedCourse, setSelectedCourse] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch students
                const studentsRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}students`)
                const studentsData = await studentsRes.json()
                setStudents(studentsData)

                // Fetch scheduled courses
                const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}scheduledcourses`)
                const coursesData = await coursesRes.json()
                setScheduledCourses(coursesData)
            } catch (err) {
                setError('Failed to fetch data')
                console.error('Error fetching data:', err)
            }
        }

        fetchData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}students/${selectedStudent}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scheduledCourseId: parseInt(selectedCourse)
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to register for course')
            }

            const data = await response.json()
            alert(data.status === 'registered' ? 'Successfully registered for course!' : 'Added to waitlist!')
            router.push('/dashboard') // Adjust this route as needed
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
            <h1 className="text-[32px] sm:text-[64px] font-bold mb-4">Course Registration</h1>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center gap-4 w-full max-w-md bg-white p-4 rounded-lg shadow-md border border-gray-300"
            >
                <div className="w-full">
                    <select 
                        value={selectedStudent}
                        onChange={(e) => setSelectedStudent(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        required
                        disabled={loading}
                    >
                        <option value="">Select a student...</option>
                        {students.map((student) => (
                            <option key={student.id} value={student.id}>
                                {student.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full">
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                        required
                        disabled={loading}
                    >
                        <option value="">Select a course...</option>
                        {scheduledCourses.map((course) => (
                            <option key={course.id} value={course.id}>
                                {course.course?.title} - {course.instructor?.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-4 py-2 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                    {loading ? "Registering..." : "Register for Course"}
                </button>
            </form>
        </div>
    )
}
