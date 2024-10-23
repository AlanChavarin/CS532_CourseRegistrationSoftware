const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');

// Get all courses
router.get('/', getCourses);

// Get a single course
router.get('/:courseid', getCourse);

// Create a new course
router.post('/', createCourse);

// Update a course
router.put('/:courseid', updateCourse);

// Delete a course
router.delete('/:courseid', deleteCourse);

module.exports = router;
