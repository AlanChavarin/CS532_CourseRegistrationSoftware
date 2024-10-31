const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { dates } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all dates
// @route   GET /api/dates
// @access  Public
const getDates = asyncHandler(async (req, res) => {
    const allDates = await db.query.dates.findMany({
        with: {
            scheduledCourse: true,
            faculty: true
        }
    });
    res.status(200).json(allDates);
});

// @desc    Get single date
// @route   GET /api/dates/:id
// @access  Public
const getDate = asyncHandler(async (req, res) => {
    const date = await db.query.dates.findFirst({
        where: eq(dates.id, parseInt(req.params.id)),
        with: {
            scheduledCourse: true,
            faculty: true
        }
    });

    if (!date) {
        res.status(404);
        throw new Error('Date not found');
    }

    res.status(200).json(date);
});

// @desc    Create new date
// @route   POST /api/dates
// @access  Private/Admin
const createDate = asyncHandler(async (req, res) => {
    const { day, startTime, endTime, scheduledCourseId, facultyId } = req.body;

    if (!day || !startTime || !endTime) {
        res.status(400);
        throw new Error('Please provide day, start time, and end time');
    }

    const newDate = await db.insert(dates).values({
        day,
        startTime,
        endTime,
        scheduledCourseId: scheduledCourseId || null,
        facultyId: facultyId || null
    }).returning();

    res.status(201).json(newDate[0]);
});

// @desc    Update date
// @route   PUT /api/dates/:id
// @access  Private/Admin
const updateDate = asyncHandler(async (req, res) => {
    const dateId = parseInt(req.params.id);
    const { day, startTime, endTime, scheduledCourseId, facultyId } = req.body;

    const existingDate = await db.query.dates.findFirst({
        where: eq(dates.id, dateId)
    });

    if (!existingDate) {
        res.status(404);
        throw new Error('Date not found');
    }

    const updatedDate = await db.update(dates)
        .set({
            day: day || existingDate.day,
            startTime: startTime || existingDate.startTime,
            endTime: endTime || existingDate.endTime,
            scheduledCourseId: scheduledCourseId !== undefined ? scheduledCourseId : existingDate.scheduledCourseId,
            facultyId: facultyId !== undefined ? facultyId : existingDate.facultyId
        })
        .where(eq(dates.id, dateId))
        .returning();

    res.status(200).json(updatedDate[0]);
});

// @desc    Delete date
// @route   DELETE /api/dates/:id
// @access  Private/Admin
const deleteDate = asyncHandler(async (req, res) => {
    const dateId = parseInt(req.params.id);

    const existingDate = await db.query.dates.findFirst({
        where: eq(dates.id, dateId)
    });

    if (!existingDate) {
        res.status(404);
        throw new Error('Date not found');
    }

    await db.delete(dates).where(eq(dates.id, dateId));

    res.status(200).json({ message: 'Date deleted successfully' });
});

module.exports = {
    getDates,
    getDate,
    createDate,
    updateDate,
    deleteDate
};
