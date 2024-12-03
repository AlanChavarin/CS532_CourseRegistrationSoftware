const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { scheduledCourses } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all scheduled courses
// @route   GET /api/scheduled-courses
// @access  Public
const getScheduledCourses = asyncHandler(async (req, res) => {
    const allScheduledCourses = await db.query.scheduledCourses.findMany({
        with: {
            instructor: true,
            course: true
        }
    });
    res.status(200).json(allScheduledCourses);
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
