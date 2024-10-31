const express = require('express')
const router = express.Router()
const {
  getStudentNotes,
  getStudentNote, 
  createStudentNote,
  updateStudentNote,
  deleteStudentNote
} = require('../controllers/studentNotesController')

// Get all student notes
router.route('/').get(getStudentNotes)

// Create a new student note
router.route('/').post(createStudentNote)

// Get a single student note
router.route('/:id').get(getStudentNote)

// Update a student note
router.route('/:id').put(updateStudentNote)

// Delete a student note
router.route('/:id').delete(deleteStudentNote)

module.exports = router
