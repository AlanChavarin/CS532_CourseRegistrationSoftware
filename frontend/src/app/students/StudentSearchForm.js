"use client"
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function StudentSearchForm({ setStudents }) {
  const [formData , setFormData] = useState({
    searchTerm: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const searchParams = new URLSearchParams(formData)
      console.log("API KEY", process.env.NEXT_PUBLIC_API_KEY)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}students/?${searchParams}`)

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      // Handle the response data here
      console.log(data)
      setStudents(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 w-full max-w-md bg-white p-4 rounded-lg shadow-md border border-gray-300">
        <input 
          type="text" 
          placeholder="Search for students"
          name="searchTerm"
          value={formData.searchTerm}
          onChange={(e) => handleChange(e)}
          disabled={isLoading}
          className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 font-bold text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Searching...' : 'Search'}
          <FontAwesomeIcon icon={faSearch} className="ml-2" />
        </button>
    </form>
  )
}
export default StudentSearchForm