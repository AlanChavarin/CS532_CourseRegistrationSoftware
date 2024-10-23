const express = require('express');
const router = express.Router();
const {
    getFaculty,
    getFacultyMember,
    createFacultyMember,
    updateFacultyMember,
    deleteFacultyMember
} = require('../controllers/facultyController');

// Get all faculty
router.get('/', getFaculty);

// Get a single faculty member
router.get('/:facultyid', getFacultyMember);

// Create a new faculty member
router.post('/', createFacultyMember);

// Update a faculty member
router.put('/:facultyid', updateFacultyMember);

// Delete a faculty member
router.delete('/:facultyid', deleteFacultyMember);

module.exports = router;
