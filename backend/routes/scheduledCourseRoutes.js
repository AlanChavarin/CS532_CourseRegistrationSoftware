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
router.get('/:scheduledCourseid', getScheduledCourse);

// Create a new scheduled course
router.post('/', createScheduledCourse);

// Update a scheduled course
router.put('/:scheduledCourseid', updateScheduledCourse);

// Delete a scheduled course
router.delete('/:scheduledCourseid', deleteScheduledCourse);

module.exports = router;
