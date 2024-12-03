"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

export default function AddCourse() {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    units: "",
    departmentId: "",
    isGraduateLevel: false,
  });

  const [departments, setDepartments] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}departments`)
      .then(res => res.json())
      .then(data => setDepartments(data))
  }, [])

  useEffect(() => {
    console.log(departments)
  }, [departments])

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      /**
       * @TODO Backend Integration Required:
       *
       * Express.js endpoint: POST /api/courses
       *
       * Request body: {
       *   courseCode: string,
       *   courseTitle: string,
       *   courseDescription: string,
       *   courseUnits: number,
       *   departmentId: number,
       *   isGraduateLevel: boolean
       * }
       *
       * Required validation:
       * - Course code must be unique (UK constraint from ER diagram)
       * - Course title required
       * - Units must be positive number
       * - Department ID must exist in departments table (FK constraint)
       */

      console.log("API KEY", process.env.NEXT_PUBLIC_API_KEY);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}courses`,
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
        throw new Error("Failed to create course");
      }

      // Redirect to courses view page on success
      window.location.href = "/courses";
    } catch (err) {
      setError(err.message || "Failed to create course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faBook} />
        <h1 className="font-bold mb-4">Add Course</h1>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="code"
              className="text-sm font-semibold text-gray-600"
            >
              Course Code
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course code"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="title"
              className="text-sm font-semibold text-gray-600"
            >
              Course Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course title"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-600"
            >
              Course Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Enter course description"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="units"
              className="text-sm font-semibold text-gray-600"
            >
              Course Units
            </label>
            <input
              type="number"
              id="units"
              name="units"
              value={formData.units}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter number of units"
              min="1"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="departmentId"
              className="text-sm font-semibold text-gray-600"
            >
              Department
            </label>
            {departments.length > 0 ? (
              <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            ) : (
              <p>Finding departments....</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isGraduateLevel"
              name="isGraduateLevel"
              checked={formData.isGraduateLevel}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isGraduateLevel" className="text-sm text-gray-600">
              Graduate Level Course
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"
          >
            {isLoading ? "Creating Course..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
