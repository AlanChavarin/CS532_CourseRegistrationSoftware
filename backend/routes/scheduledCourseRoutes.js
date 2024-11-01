const express = require('express');
const router = express.Router();
const {
    getScheduledCourses,
    getScheduledCourse,
    createScheduledCourse,
    updateScheduledCourse,
    deleteScheduledCourse
} = require('../controllers/scheduledCourseController');

// Get all scheduled courses
router.get('/', getScheduledCourses);

// Get a single scheduled course
router.get('/:scheduledCourseId', getScheduledCourse);

// Create a new scheduled course
router.post('/', createScheduledCourse);

// Update a scheduled course
router.put('/:scheduledCourseId', updateScheduledCourse);

// Delete a scheduled course
router.delete('/:scheduledCourseId', deleteScheduledCourse);

module.exports = router;
