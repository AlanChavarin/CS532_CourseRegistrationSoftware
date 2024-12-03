"use client";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faEdit, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function CourseDetails({ params }) {
  const [course, setCourse] = useState(null);
  const [scheduledCourses, setScheduledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        // Fetch course details
        const courseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_KEY}courses/${params.id}`
        );
        const courseData = await courseResponse.json();
        setCourse(courseData);

        // Fetch scheduled courses
        const scheduledResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_KEY}scheduledcourses?courseId=${params.id}`
        );
        const scheduledData = await scheduledResponse.json();
        setScheduledCourses(scheduledData);
      } catch (err) {
        setError("Failed to fetch course details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl">Loading course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl text-red-500">{error || "Course not found"}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 sm:p-8 md:p-[32px] max-w-7xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <Link
          href="/courses"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Courses
        </Link>

        <Link
          href={`/admindashboard/editcourse/${course.id}`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faEdit} />
          Edit Course
        </Link>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <FontAwesomeIcon icon={faBook} className="text-4xl text-gray-600" />
          <h1 className="text-3xl font-bold">{course.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Course Information</h2>
            <div className="space-y-3">
              <p>
                <span className="font-semibold">Course Code:</span>{" "}
                {course.code}
              </p>
              <p>
                <span className="font-semibold">Units:</span> {course.units}
              </p>
              <p>
                <span className="font-semibold">Level:</span>{" "}
                {course.isGraduateLevel ? "Graduate" : "Undergraduate"}
              </p>
              <p>
                <span className="font-semibold">Department:</span>{" "}
                {course.department?.name}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6">Scheduled Sections</h2>
        {scheduledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledCourses.map((section) => (
              <div key={section.id} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">
                  Section {section.scheduleNumber}
                </h3>
                <p className="text-sm text-gray-600">
                  Instructor: {section.instructor?.name}
                </p>
                <p className="text-sm text-gray-600">
                  Location: {section.location}
                </p>
                <p className="text-sm text-gray-600">
                  Available Seats: {section.availableSeats}/{section.seats}
                </p>
                <p className="text-sm text-gray-600">
                  {section.semester} {section.year}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No scheduled sections available.</p>
        )}
      </div>
    </div>
  );
}
