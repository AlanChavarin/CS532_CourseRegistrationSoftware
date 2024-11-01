const express = require('express');
const router = express.Router();
const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');

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
