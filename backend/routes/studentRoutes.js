const express = require('express');
const router = express.Router();
const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    registerForCourse,
    getRegisteredCourses,
    dropCourse,
    getWaitlistPosition
} = require('../controllers/studentController');

// Course registration routes
router.post('/:studentId/register', registerForCourse);
router.get('/:studentId/courses', getRegisteredCourses);
router.delete('/:studentId/courses/:registrationId', dropCourse);

// Waitlist route
router.get('/:studentId/waitlist/:scheduledCourseId', getWaitlistPosition);

// Get all students
router.get('/', getStudents);

// Get a single student
router.get('/:studentId', getStudent);

// Create a new student
router.post('/', createStudent);

// Update a student
router.put('/:studentId', updateStudent);

// Delete a student
router.delete('/:studentId', deleteStudent);


module.exports = router;
