"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";

export default function AddDepartment() {
  const [formData, setFormData] = useState({
    departmentName: "",
    departmentCode: "",
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
       * Express.js endpoint: POST /api/departments
       *
       * Request body: {
       *   departmentName: string,
       *   departmentCode: string
       * }
       *
       * Required validation:
       * - Department name required
       * - Department code must be unique (UK constraint)
       * - Department code format validation (e.g., uppercase letters)
       */

      console.log("API KEY", process.env.NEXT_PUBLIC_API_KEY);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}departments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create department");
      }

      // Redirect to departments view page on success
      window.location.href = "/admindashboard/departments";
    } catch (err) {
      setError(err.message || "Failed to create department. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faBuilding} />
        <h1 className="font-bold mb-4">Add Department</h1>
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
              htmlFor="departmentName"
              className="text-sm font-semibold text-gray-600"
            >
              Department Name*
            </label>
            <input
              type="text"
              id="departmentName"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department name"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="departmentCode"
              className="text-sm font-semibold text-gray-600"
            >
              Department Code*
            </label>
            <div className="flex flex-col gap-1">
              <input
                type="text"
                id="departmentCode"
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="e.g., CS, MATH"
                maxLength="4"
                pattern="[A-Z]{2,4}"
                title="2-4 uppercase letters"
                required
              />
              <p className="text-xs text-gray-500">
                2-4 uppercase letters (e.g., CS for Computer Science)
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"
          >
            {isLoading ? "Creating Department..." : "Create Department"}
          </button>
        </form>
      </div>
    </div>
  );
}
