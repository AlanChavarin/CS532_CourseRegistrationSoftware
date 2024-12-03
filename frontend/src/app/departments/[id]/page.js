"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faEdit,
  faArrowLeft,
  faUser,
  faBook,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function DepartmentDetails({ params }) {
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_KEY}departments/${params.id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch department details");
        }

        setDepartment(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl">Loading department details...</p>
      </div>
    );
  }

  if (error || !department) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl text-red-500">
          {error || "Department not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px] max-w-7xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <Link
          href="/departments"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Departments
        </Link>

        <Link
          href={`/admindashboard/editdepartment/${department.id}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faEdit} />
          Edit Department
        </Link>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <FontAwesomeIcon
            icon={faBuilding}
            className="text-4xl text-gray-600"
          />
          <h1 className="text-3xl font-bold">{department.name}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-lg mb-2">
              <span className="font-semibold">Department Code:</span>{" "}
              {department.departmentCode}
            </p>
            {department.headFaculty && (
              <p className="text-lg mb-2">
                <span className="font-semibold">Department Head:</span>{" "}
                {department.headFaculty.name}
              </p>
            )}
          </div>
          {department.description && (
            <p className="text-gray-600">{department.description}</p>
          )}
        </div>
      </div>

      {/* Faculty Section */}
      <div className="w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} />
            Faculty Members
          </h2>
          <span className="text-gray-500">
            {department.faculty?.length || 0} Members
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {department.faculty?.map((faculty) => (
            <Link
              key={faculty.id}
              href={`/faculty/${faculty.id}`}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <p className="font-semibold">{faculty.name}</p>
              <p className="text-sm text-gray-600">{faculty.positionTitle}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div className="w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faBook} />
            Courses
          </h2>
          <span className="text-gray-500">
            {department.courses?.length || 0} Courses
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {department.courses?.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <p className="font-semibold">{course.title}</p>
              <p className="text-sm text-gray-600">{course.code}</p>
              <p className="text-sm text-gray-500">{course.units} Units</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Majors Section */}
      <div className="w-full bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faUserGraduate} />
            Majors
          </h2>
          <span className="text-gray-500">
            {department.majors?.length || 0} Majors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {department.majors?.map((major) => (
            <Link
              key={major.id}
              href={`/majors/${major.id}`}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              <p className="font-semibold">{major.title}</p>
              <p className="text-sm text-gray-600">
                {major.requiredUnits} Required Units
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
