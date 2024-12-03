const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { scheduledCourses } = require('../schema')
const { eq, sql, and } = require('drizzle-orm')

// @desc    Get all scheduled courses
// @route   GET /api/scheduled-courses
// @access  Public
const getScheduledCourses = asyncHandler(async (req, res) => {
    const { semester, year, courseId, instructorId, searchTerm } = req.query;

    let query = {
        with: {
            instructor: true,
            course: true
        },
        where: undefined
    };

    let conditions = [];

    if (semester) {
        conditions.push(eq(scheduledCourses.semester, semester));
    }

    if (year) {
        conditions.push(eq(scheduledCourses.year, parseInt(year)));
    }

    if (courseId) {
        conditions.push(eq(scheduledCourses.courseId, parseInt(courseId)));
    }

    if (instructorId) {
        conditions.push(eq(scheduledCourses.instructorId, parseInt(instructorId)));
    }

    if (searchTerm) {
        const formattedSearch = searchTerm
            .trim()
            .split(/\s+/)
            .join(' & ');

        conditions.push(sql`
            EXISTS (
                SELECT 1
                FROM ${scheduledCourses} sc
                LEFT JOIN courses c ON c.id = sc.course_id
                LEFT JOIN faculty i ON i.id = sc.instructor_id
                WHERE 
                    to_tsvector('english', ${scheduledCourses.location}) @@ to_tsquery('english', ${formattedSearch})
                    OR
                    to_tsvector('english', c."title") @@ to_tsquery('english', ${formattedSearch})
                    OR
                    to_tsvector('english', c."description") @@ to_tsquery('english', ${formattedSearch})
                    OR
                    to_tsvector('english', i."name") @@ to_tsquery('english', ${formattedSearch})
            )
        `);
    }

    if (conditions.length > 0) {
        query.where = and(...conditions);
    }

    const scheduledCoursesResult = await db.query.scheduledCourses.findMany(query);
    res.status(200).json(scheduledCoursesResult);
});

// @desc    Get single scheduled course
// @route   GET /api/scheduled-courses/:id
// @access  Public
const getScheduledCourse = asyncHandler(async (req, res) => {
    const scheduledCourse = await db.query.scheduledCourses.findFirst({
        where: eq(scheduledCourses.id, parseInt(req.params.scheduledCourseId)),
        with: {
            course: true,
            instructor: true
        }
    });

    if (!scheduledCourse) {
        res.status(404);
        throw new Error('Scheduled course not found');
    }

    res.status(200).json(scheduledCourse);
});

// @desc    Create new scheduled course
// @route   POST /api/scheduled-courses
// @access  Private/Admin
const createScheduledCourse = asyncHandler(async (req, res) => {
    const { courseId, instructorId, location, semester, year, seats, scheduleNumber } = req.body;

    if (!courseId || !instructorId || !location || !semester || !year) {
        res.status(400);
        throw new Error('Please provide all required fields for the scheduled course');
    }

    const newScheduledCourse = await db.insert(scheduledCourses).values({
        courseId,
        instructorId,
        location,
        semester,
        year,
        seats,
        scheduleNumber
    }).returning();

    res.status(201).json(newScheduledCourse[0]);
});

// @desc    Update scheduled course
// @route   PUT /api/scheduled-courses/:id
// @access  Private/Admin
const updateScheduledCourse = asyncHandler(async (req, res) => {
    const scheduledCourse = await db.query.scheduledCourses.findFirst({
        where: eq(scheduledCourses.id, parseInt(req.params.scheduledCourseId))
    });

    if (!scheduledCourse) {
        res.status(404);
        throw new Error('Scheduled course not found');
    }


    const updatedScheduledCourse = await db.update(scheduledCourses)
        .set(req.body)
        .where(eq(scheduledCourses.id, parseInt(req.params.scheduledCourseId)))
        .returning();

    res.status(200).json(updatedScheduledCourse[0]);
});

// @desc    Delete scheduled course
// @route   DELETE /api/scheduled-courses/:id
// @access  Private/Admin
const deleteScheduledCourse = asyncHandler(async (req, res) => {
    const scheduledCourse = await db.query.scheduledCourses.findFirst({
        where: eq(scheduledCourses.id, parseInt(req.params.scheduledCourseId))
    });

    if (!scheduledCourse) {
        res.status(404);
        throw new Error('Scheduled course not found');
    }

    await db.delete(scheduledCourses)
        .where(eq(scheduledCourses.id, parseInt(req.params.scheduledCourseId)));

    res.status(200).json({ message: 'Scheduled course deleted successfully' });
});

module.exports = {
    getScheduledCourses,
    getScheduledCourse,
    createScheduledCourse,
    updateScheduledCourse,
    deleteScheduledCourse
};
