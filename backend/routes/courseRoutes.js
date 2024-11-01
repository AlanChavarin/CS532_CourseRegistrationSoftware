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
router.get('/:courseId', getCourse);

// Create a new course
router.post('/', createCourse);

// Update a course
router.put('/:courseId', updateCourse);

// Delete a course
router.delete('/:courseId', deleteCourse);

module.exports = router;
