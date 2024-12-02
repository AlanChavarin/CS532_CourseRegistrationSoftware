"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGraduationCap } from "@fortawesome/free-solid-svg-icons";

export default function AddMajor() {
  const [formData, setFormData] = useState({
    majorName: "",
    departmentId: "",
    requiredUnits: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
       * Express.js endpoint: POST /api/majors
       *
       * Request body: {
       *   majorName: string,
       *   departmentId: number,
       *   requiredUnits: number
       * }
       *
       * Required validation:
       * - Major name must be unique (UK constraint)
       * - Department ID must exist in departments table (FK constraint)
       * - Required units must be positive number
       */

      console.log("API KEY", process.env.NEXT_PUBLIC_API_KEY);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_KEY}majors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create major");
      }

      // Redirect to majors page on success
      window.location.href = "/admindashboard/viewmajors";
    } catch (err) {
      setError(err.message || "Failed to create major. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faGraduationCap} />
        <h1 className="font-bold mb-4">Add Major</h1>
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
              htmlFor="majorName"
              className="text-sm font-semibold text-gray-600"
            >
              Major Name*
            </label>
            <input
              type="text"
              id="majorName"
              name="majorName"
              value={formData.majorName}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter major name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="departmentId"
              className="text-sm font-semibold text-gray-600"
            >
              Department*
            </label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a department</option>
              {/* @TODO: Fetch departments from backend */}
              <option value="1">Computer Science</option>
              <option value="2">Mathematics</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="requiredUnits"
              className="text-sm font-semibold text-gray-600"
            >
              Required Units*
            </label>
            <input
              type="number"
              id="requiredUnits"
              name="requiredUnits"
              value={formData.requiredUnits}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter required units"
              min="1"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"
          >
            {isLoading ? "Creating Major..." : "Create Major"}
          </button>
        </form>
      </div>
    </div>
  );
}
