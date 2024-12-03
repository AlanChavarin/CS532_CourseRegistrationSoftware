"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";

export default function AddFaculty() {
  const [formData, setFormData] = useState({
    //firstName: "",
    //lastName: "",
    name: "",
    positionTitle: "",
    phoneNumber: "",
    officeNumber: "",
    //officeHours: "",
    mainDepartment: "",
    userEmail: ""
  });

  const [departments, setDepartments] = useState([])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}departments`)
      .then(res => res.json())
      .then(data => setDepartments(data))
  }, [])

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
       * Express.js endpoint: POST /api/faculty
       *
       * Request body: {
       *   firstName: string,
       *   lastName: string,
       *   positionTitle: string,
       *   officePhone: string,
       *   officeNumber: string,
       *   officeHours: string,
       *   departmentId: number
       * }
       *
       * Required validation:
       * - Faculty name fields required
       * - Department ID must exist in departments table (FK constraint)
       * - Office phone number format validation
       * - Office hours format validation
       */

      console.log("API KEY", process.env.NEXT_PUBLIC_API_KEY);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}faculty`,
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
        throw new Error("Failed to create faculty member");
      }

      // Redirect to faculty view page on success
      window.location.href = "/faculty";
    } catch (err) {
      setError(
        err.message || "Failed to create faculty member. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faUserTie} />
        <h1 className="font-bold mb-4">Add Faculty</h1>
      </div>

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-600"
            >
              Full Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Position Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="positionTitle"
                className="text-sm font-semibold text-gray-600"
              >
                Position Title*
              </label>
              <input
                type="text"
                id="positionTitle"
                name="positionTitle"
                value={formData.positionTitle}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter position title"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="mainDepartment"
                className="text-sm font-semibold text-gray-600"
              >
                Department
              </label>
              {departments.length > 0 ? (
                <select
                  id="mainDepartment"
                  name="mainDepartment"
                  value={formData.mainDepartment}
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
          </div>

          {/* Office Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phoneNumber"
                className="text-sm font-semibold text-gray-600"
              >
                Office Phone*
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter office phone"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="officeNumber"
                className="text-sm font-semibold text-gray-600"
              >
                Office Number*
              </label>
              <input
                type="text"
                id="officeNumber"
                name="officeNumber"
                value={formData.officeNumber}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter office number"
                required
              />
            </div>
          </div>

          {/* office hours functionality is a bit more complex, and will be implemented later */}

          {/* <div className="flex flex-col gap-2">
            <label
              htmlFor="officeHours"
              className="text-sm font-semibold text-gray-600"
            >
              Office Hours*
            </label>
            <input
              type="text"
              id="officeHours"
              name="officeHours"
              value={formData.officeHours}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Mon/Wed 2-4pm, Tue/Thu 1-3pm"
              required
            />
          </div>   */}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="userEmail"
              className="text-sm font-semibold text-gray-600"
            >
              User Email*
            </label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user email"
              required
            />
          </div>
          <button
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"
          >
            {isLoading ? "Creating Faculty Member..." : "Create Faculty Member"}
          </button>
        </form>
      </div>
    </div>
  );
}
