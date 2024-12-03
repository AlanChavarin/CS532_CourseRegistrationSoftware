"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function EditCourse({ params }) {
  const [formData, setFormData] = useState({
    code: "",
    title: "",
    description: "",
    units: "",
    departmentId: "",
    isGraduateLevel: false,
  });

  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch departments for the dropdown
        const deptResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_KEY}departments`
        );
        const deptData = await deptResponse.json();
        setDepartments(deptData);

        // Fetch course data
        const courseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_KEY}courses/${params.id}`
        );
        const courseData = await courseResponse.json();

        if (!courseResponse.ok) {
          throw new Error(courseData.message || "Failed to fetch course");
        }

        setFormData({
          code: courseData.code || "",
          title: courseData.title || "",
          description: courseData.description || "",
          units: courseData.units || "",
          departmentId: courseData.departmentId || "",
          isGraduateLevel: courseData.isGraduateLevel || false,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_KEY}courses/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update course");
      }

      // Redirect back to course details page
      window.location.href = `/courses/${params.id}`;
    } catch (err) {
      setError(err.message || "Failed to update course. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl">Loading course details...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <Link
            href={`/courses/${params.id}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Course Details
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <FontAwesomeIcon icon={faBook} className="text-4xl text-gray-600" />
          <h1 className="text-3xl font-bold">Edit Course</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-6 p-4 text-red-500 bg-red-50 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="code"
                  className="text-sm font-semibold text-gray-600"
                >
                  Course Code*
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="title"
                  className="text-sm font-semibold text-gray-600"
                >
                  Course Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
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
                rows={4}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="units"
                  className="text-sm font-semibold text-gray-600"
                >
                  Units*
                </label>
                <input
                  type="number"
                  id="units"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  min="1"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
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
              <label
                htmlFor="isGraduateLevel"
                className="text-sm text-gray-600"
              >
                Graduate Level Course
              </label>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                disabled={saveLoading}
                className="flex-1 px-6 py-2 text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors duration-200"
              >
                {saveLoading ? "Saving Changes..." : "Save Changes"}
              </button>

              <Link
                href={`/courses/${params.id}`}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
