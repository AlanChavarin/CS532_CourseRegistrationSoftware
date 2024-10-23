const express = require('express')
const router = express.Router()
const {getMajors, getMajor, createMajor, updateMajor, deleteMajor} = require('../controllers/majorController')

// Get all majors
router.get('/', getMajors)

// Get a single major
router.get('/:majorid', getMajor)

// Create a new major
router.post('/', createMajor)

// Update a major
router.put('/:majorid', updateMajor)

// Delete a major
router.delete('/:majorid', deleteMajor)

module.exports = router

