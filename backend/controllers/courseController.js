const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { courses, scheduledCourses, courseQualifiedFaculty } = require('../schema')
const { eq, sql } = require('drizzle-orm')

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = asyncHandler(async (req, res) => {
    const { searchTerm, departmentId, majorId } = req.query;
    let result;


    if (departmentId) {
        result = await db.query.courses.findMany({
            where: (courses) => eq(courses.departmentId, departmentId)
        })
    } else if (majorId) {   
        result = await db.query.courses.findMany({
            where: (courses) => eq(courses.majorId, majorId)
        })
    } else if (searchTerm) {
        // Convert search term to tsquery format and handle multiple words
        const formattedSearch = searchTerm
            .trim()
            .split(/\s+/)
            .join(' & ');

        result = await db.execute(sql`
            SELECT * FROM courses 
            WHERE to_tsvector('english', title) @@ to_tsquery('english', ${formattedSearch})
            ORDER BY ts_rank(to_tsvector('english', title), to_tsquery('english', ${formattedSearch})) DESC
        `);

        result = result.rows;
    } else {
        result = await db.query.courses.findMany();
    }

    res.status(200).json(result);
})

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = asyncHandler(async (req, res) => {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, parseInt(req.params.courseId)),
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
    const { title, description, units, code, departmentId, isGraduateLevel } = req.body;

    if (!title || !units || !departmentId) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    const course = await db.insert(courses).values({
        title,
        description,
        units,
        code,
        departmentId,
        isGraduateLevel: isGraduateLevel || false
    }).returning();

    res.status(201).json(course[0]);
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = asyncHandler(async (req, res) => {
    const courseId = parseInt(req.params.courseId);
    const { title, description, units, departmentId, isGraduateLevel } = req.body;

    const existingCourse = await db.query.courses.findFirst({
        where: eq(courses.id, courseId)
    });

    if (!existingCourse) {
        res.status(404);
        throw new Error('Course not found');
    }

    const updatedCourse = await db.update(courses)
        .set({
            title: title || existingCourse.title,
            description: description || existingCourse.description,
            units: units || existingCourse.units,
            departmentId: departmentId || existingCourse.departmentId,
            isGraduateLevel: isGraduateLevel !== undefined ? isGraduateLevel : existingCourse.isGraduateLevel
        })
        .where(eq(courses.id, courseId))
        .returning();

    res.status(200).json(updatedCourse[0]);
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
    const courseId = parseInt(req.params.courseId);

    // First check if course exists
    const existingCourse = await db.query.courses.findFirst({
        where: eq(courses.id, courseId)
    });

    if (!existingCourse) {
        res.status(404);
        throw new Error('Course not found');
    }

    // Delete related records first
    await db.delete(courseQualifiedFaculty).where(eq(courseQualifiedFaculty.courseId, courseId));
    await db.delete(scheduledCourses).where(eq(scheduledCourses.courseId, courseId));
    
    // Then delete the course
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
