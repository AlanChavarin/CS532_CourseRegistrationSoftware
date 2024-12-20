"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddScheduledCourse() {
  const [formData, setFormData] = useState({
    courseId: "",
    instructorId: "",
    location: "",
    semester: "",
    year: new Date().getFullYear(),
    seats: "",
    scheduleNumber: "",
    //startTime: "",
    //endTime: "",
    //daysOfWeek: "",
  });

  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}courses`);
      const data = await response.json();
      setCourses(data);
    };

    const fetchFaculty = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}faculty`);
      const data = await response.json();
      setFaculty(data);
    };

    fetchCourses();
    fetchFaculty();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If changing max seats, automatically update available seats
    if (name === "maxSeats") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        availableSeats: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      /**
       * @TODO Backend Integration Required:
       *
       * Express.js endpoint: POST /api/coursesections
       *
       * Request body: {
       *   courseId: number,
       *   scheduleNumber: string,
       *   startTime: string,
       *   endTime: string,
       *   daysOfWeek: string,
       *   location: string,
       *   facultyId: number,
       *   maxSeats: number,
       *   availableSeats: number,
       *   semester: string,
       *   year: number
       * }
       *
       * Required validation:
       * - Course ID must exist in courses table (FK constraint)
       * - Faculty ID must exist in faculty table (FK constraint)
       * - Schedule number must be unique for each course
       * - End time must be after start time
       * - Max seats and available seats must be positive numbers
       * - Valid semester value (e.g., Fall, Spring, Summer)
       * - Valid year format
       */

      console.log("API KEY", process.env.NEXT_PUBLIC_API_KEY);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}scheduledcourses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if(data.errorMessage){
        throw new Error(data.errorMessage);
      }

      if (!response.ok) {
        throw new Error("Failed to create scheduled course");
      }

      // Redirect to course sections view page on success
      window.location.href = "/scheduledcourses";
    } catch (err) {
      setError(
        err.message || "Failed to create scheduled course. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faCalendarPlus} />
        <h1 className="font-bold mb-4">Add Scheduled Course</h1>
      </div>

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Selection */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="courseId"
                className="text-sm font-semibold text-gray-600"
              >
                Course*
              </label>
              {courses.length > 0 && (
                <select
                  id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Schedule Number */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="scheduleNumber"
                className="text-sm font-semibold text-gray-600"
              >
                Schedule Number*
              </label>
              <input
                type="number"
                id="scheduleNumber"
                name="scheduleNumber"
                value={formData.scheduleNumber}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter schedule number"
                required
              />
            </div>
          </div>

          {/* date functionality to be added later */}

          {/* Time and Days */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* <div className="flex flex-col gap-2">
              <label
                htmlFor="startTime"
                className="text-sm font-semibold text-gray-600"
              >
                Start Time*
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}

            {/* date functionality to be added later */}

            {/* <div className="flex flex-col gap-2">
              <label
                htmlFor="endTime"
                className="text-sm font-semibold text-gray-600"
              >
                End Time*
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div> */}

            {/* date functionality to be added later */}

            {/* <div className="flex flex-col gap-2">
              <label
                htmlFor="daysOfWeek"
                className="text-sm font-semibold text-gray-600"
              >
                Days of Week*
              </label>
              <input
                type="text"
                id="daysOfWeek"
                name="daysOfWeek"
                value={formData.daysOfWeek}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., MWF or TTH"
                required
              />
            </div> */}
          </div>

          {/* Location and Instructor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="location"
                className="text-sm font-semibold text-gray-600"
              >
                Location*
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room number/building"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="instructorId"
                className="text-sm font-semibold text-gray-600"
              >
                Instructor*
              </label>

              {faculty.length > 0 && (
                <select
                  id="instructorId"
                  name="instructorId"
                  value={formData.instructorId}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select an instructor</option>
                  {faculty.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Seats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="seats"
                className="text-sm font-semibold text-gray-600"
              >
                Maximum Seats*
              </label>
              <input
                type="number"
                id="seats"
                name="seats"
                value={formData.seats}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter max seats"
                min="1"
                required
              />
            </div>

          </div>

          {/* Term Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="semester"
                className="text-sm font-semibold text-gray-600"
              >
                Semester*
              </label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a semester</option>
                <option value="Fall">Fall</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="year"
                className="text-sm font-semibold text-gray-600"
              >
                Year*
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={new Date().getFullYear()}
                max={new Date().getFullYear() + 2}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"
          >
            {isLoading
              ? "Creating Scheduled Course..."
              : "Create Scheduled Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
