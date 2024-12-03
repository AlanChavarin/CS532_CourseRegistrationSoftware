"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function ScheduledCourseSearchForm({ setScheduledCourses }) {
  const [formData, setFormData] = useState({
    semester: "",
    year: "",
    courseId: "",
    instructorId: "",
    searchTerm: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}courses/`);
      const data = await response.json();
      setCourses(data);
    };
    fetchCourses();

    const fetchInstructors = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}faculty/`);
      const data = await response.json();
      setInstructors(data);
    };
    fetchInstructors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const searchParams = new URLSearchParams(formData);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}scheduledcourses/?${searchParams}`
      );
      
      const data = await response.json();
      
      if(data.errorMessage) {
        throw new Error(data.errorMessage);
      }

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setScheduledCourses(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center gap-4 w-full max-w-md bg-white p-4 rounded-lg shadow-md border border-gray-300"
    >
      <select
        name="semester"
        value={formData.semester}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="">Select Semester</option>
        <option value="FALL">Fall</option>
        <option value="SPRING">Spring</option>
        <option value="SUMMER">Summer</option>
      </select>

      <input
        type="number"
        placeholder="Year"
        name="year"
        value={formData.year}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      {courses ? (
        <select
          name="courseId"
        value={formData.courseId}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <option value="">Select Course</option>
        {courses?.map(course => (
          <option key={course.id} value={course.id}>
            {course.title}
          </option>
          ))}
        </select>
      ) : (
        <div>Loading courses...</div> 
      )}

      {instructors ? (
        <select
          name="instructorId"
          value={formData.instructorId}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="">Select Instructor</option>
          {instructors?.map(instructor => (
            <option key={instructor.id} value={instructor.id}>
              {instructor.name}
            </option>
          ))}
        </select>
      ) : (
        <div>Loading instructors...</div> 
      )}

      <input
        type="text"
        placeholder="Search term"
        name="searchTerm"
        value={formData.searchTerm}
        onChange={handleChange}
        disabled={isLoading}
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 font-semibold text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? "Searching..." : "Search"}
        <FontAwesomeIcon icon={faSearch} className="ml-2" />
      </button>
    </form>
  );
}
export default ScheduledCourseSearchForm;
