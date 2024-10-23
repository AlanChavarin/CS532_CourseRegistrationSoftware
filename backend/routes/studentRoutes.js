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
router.get('/:studentid', getStudent);

// Create a new student
router.post('/', createStudent);

// Update a student
router.put('/:studentid', updateStudent);

// Delete a student
router.delete('/:studentid', deleteStudent);

module.exports = router;
