"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGraduate } from "@fortawesome/free-solid-svg-icons";

export default function AddStudent() {
  const [formData, setFormData] = useState({
    //firstName: "",
    //middleName: "",
    //lastName: "",
    name: "",
    address: "",
    phoneNumber: "",
    dateOfBirth: "",
    majorId: "",
    minorId: "",
    gpa: "",
    userEmail: "", // For user authentication connection
  });
  
  const [majors, setMajors] = useState([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_KEY}majors`)
      .then(res => res.json())
      .then(data => setMajors(data))
  }, []);

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
       * Express.js endpoint: POST /api/students
       *
       * Request body: {
       *   firstName: string,
       *   middleName?: string,
       *   lastName: string,
       *   address: string,
       *   phoneNumber: string,
       *   dateOfBirth: date,
       *   majorId?: number,
       *   minorId?: number,
       *   gpa: number,
       *   userId: number
       * }
       *
       * Required validation:
       * - Name fields should allow hyphenated names
       * - Phone number format validation
       * - Date of birth valid format and reasonable date
       * - GPA between 0.0 and 4.0
       * - Major/Minor IDs must exist in the majors table
       */

      console.log("API KEY", process.env.NEXT_PUBLIC_API_KEY);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      )

      const data = await response.json();

      if(data.errorMessage){
        throw new Error(data.errorMessage);
      }

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create student");
      }

      // Redirect to students view page on success
      window.location.href = "/students";
    } catch (err) {
      setError(err.message || "Failed to create student. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faUserGraduate} />
        <h1 className="font-bold mb-4">Add Student</h1>
      </div>

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Name Fields */}
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


          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="firstName"
                className="text-sm font-semibold text-gray-600"
              >
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="middleName"
                className="text-sm font-semibold text-gray-600"
              >
                Middle Name
              </label>
              <input
                type="text"
                id="middleName"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter middle name"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="lastName"
                className="text-sm font-semibold text-gray-600"
              >
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter last name"
                required
              />
            </div>
          </div> */}

          {/* Contact Information */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="address"
              className="text-sm font-semibold text-gray-600"
            >
              Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phoneNumber"
                className="text-sm font-semibold text-gray-600"
              >
                Phone Number*
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="dateOfBirth"
                className="text-sm font-semibold text-gray-600"
              >
                Date of Birth*
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Academic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="majorId"
                className="text-sm font-semibold text-gray-600"
              >
                Major
              </label>
              {majors.length > 0 && (
                <select
                  id="majorId"
                name="majorId"
                value={formData.majorId}
                onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a major</option>
                {majors.map((major) => (
                  <option key={major.id} value={major.id}>
                    {major.title}
                  </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="minorId"
                className="text-sm font-semibold text-gray-600"
              >
                Minor
              </label>
              {majors.length > 0 && (
                <select
                  id="minorId"
                  name="minorId"
                  value={formData.minorId}
                  onChange={handleChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a minor</option>
                {majors.map((major) => (
                  <option key={major.id} value={major.id}>
                    {major.title}
                  </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="gpa"
              className="text-sm font-semibold text-gray-600"
            >
              Initial GPA
            </label>
            <input
              type="number"
              id="gpa"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter GPA"
              step="0.01"
              min="0"
              max="4"
            />
          </div>

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
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"
          >
            {isLoading ? "Creating Student..." : "Create Student"}
          </button>
        </form>
      </div>
    </div>
  );
}
