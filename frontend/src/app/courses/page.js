"use client";
import CourseSearchForm from "./CourseSearchForm";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBook,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

function Courses() {
  const [courses, setCourses] = useState([]);
  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px]">
      <div className="flex flex-row items-center justify-center gap-4 text-[32px] sm:text-[64px]">
        <FontAwesomeIcon icon={faBook} />
        <h1 className="font-bold mb-4">Course Search</h1>
        <FontAwesomeIcon icon={faSearch} />
      </div>
      <CourseSearchForm setCourses={setCourses} />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {courses.map((course) => (
          <Link
            href={`/courses/${course.id}`}
            key={course.id}
            className="group bg-white p-6 rounded-lg shadow-md border border-gray-300 flex flex-col gap-2 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <h2 className="text-xl font-semibold group-hover:text-gray-600 transition-colors duration-200">
              {course.title}
            </h2>
            <p className="text-gray-600 line-clamp-2">{course.description}</p>
            <div className="mt-auto pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Units: {course.units}</p>
                  <p className="text-sm text-gray-500">
                    {course.isGraduateLevel
                      ? "Graduate Level"
                      : "Undergraduate Level"}
                  </p>
                </div>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default Courses;
