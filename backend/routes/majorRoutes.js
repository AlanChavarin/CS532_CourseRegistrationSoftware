const express = require('express')
const router = express.Router()
const {getMajors, getMajor, createMajor, updateMajor, deleteMajor} = require('../controllers/majorController')

// Get all majors
router.get('/', getMajors)

// Get a single major
router.get('/:majorId', getMajor)

// Create a new major
router.post('/', createMajor)

// Update a major
router.put('/:majorId', updateMajor)

// Delete a major
router.delete('/:majorId', deleteMajor)

module.exports = router

