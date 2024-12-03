"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function AddUser() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "",
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
       * Express.js endpoint: POST /api/users
       *
       * Request body: {
       *   username: string,
       *   email: string,
       *   password: string,
       *   userType: string
       * }
       *
       * Required validation:
       * - Username format validation
       * - Email format validation
       * - Password strength requirements
       * - UserType must be valid role
       */

      console.log("API KEY", process.env.NEXT_PUBLIC_API_KEY);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}users`,
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
        throw new Error("Failed to create user");
      }

      // Redirect to users view page on success
      window.location.href = "/users";
    } catch (err) {
      setError(err.message || "Failed to create user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faUser} />
        <h1 className="font-bold mb-4">Add User</h1>
      </div>

      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-600"
            >
              Username*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-600"
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-600"
            >
              Password*
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="userType"
              className="text-sm font-semibold text-gray-600"
            >
              User Type*
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select user type</option>
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"
          >
            {isLoading ? "Creating User..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
