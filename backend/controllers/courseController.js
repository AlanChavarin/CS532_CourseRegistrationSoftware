const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { courses, scheduledCourses, courseQualifiedFaculty } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const allCourses = await db.query.courses.findMany({
        with: {
            department: true,
            scheduledCourses: true,
            courseQualifiedFaculty: {
                with: {
                    faculty: true
                }
            }
        }
    });
    res.status(200).json(allCourses);
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, parseInt(req.params.id)),
        with: {
            department: true,
            scheduledCourses: true,
            courseQualifiedFaculty: {
                with: {
                    faculty: true
                }
            }
        }
    });

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    res.status(200).json(course);
});

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = asyncHandler(async (req, res) => {
    const { name, code, description, credits, departmentId } = req.body;

    if (!name || !code || !credits || !departmentId) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const course = await db.insert(courses).values({
        name,
        code,
        description,
        credits,
        departmentId
    }).returning();

    res.status(201).json(course[0]);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
    const courseId = parseInt(req.params.id);
    const { name, code, description, credits, departmentId } = req.body;

    const existingCourse = await db.query.courses.findFirst({
        where: eq(courses.id, courseId)
    });

    if (!existingCourse) {
        res.status(404);
        throw new Error('Course not found');
    }

    const updatedCourse = await db.update(courses)
        .set({
            name: name || existingCourse.name,
            code: code || existingCourse.code,
            description: description || existingCourse.description,
            credits: credits || existingCourse.credits,
            departmentId: departmentId || existingCourse.departmentId
        })
        .where(eq(courses.id, courseId))
        .returning();

    res.status(200).json(updatedCourse[0]);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
    const courseId = parseInt(req.params.id);

    const existingCourse = await db.query.courses.findFirst({
        where: eq(courses.id, courseId)
    });

    if (!existingCourse) {
        res.status(404);
        throw new Error('Course not found');
    }

    await db.delete(courses).where(eq(courses.id, courseId));

    res.status(200).json({ message: 'Course deleted successfully' });
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};
