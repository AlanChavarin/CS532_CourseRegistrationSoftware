const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { studentNotes } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all student notes
// @route   GET /api/student-notes
// @access  Public
const getStudentNotes = asyncHandler(async (req, res) => {
  const allNotes = await db.query.studentNotes.findMany({
    with: {
      student: true
    }
  })
  res.status(200).json(allNotes)
})

// @desc    Get single student note
// @route   GET /api/student-notes/:id
// @access  Public
const getStudentNote = asyncHandler(async (req, res) => {
  const note = await db.query.studentNotes.findFirst({
    where: eq(studentNotes.id, parseInt(req.params.id)),
    with: {
      student: true
    }
  })

  if (!note) {
    res.status(404)
    throw new Error('Note not found')
  }

  res.status(200).json(note)
})

// @desc    Create new student note
// @route   POST /api/student-notes
// @access  Private/Admin
const createStudentNote = asyncHandler(async (req, res) => {
  const { studentId, note, date } = req.body

  if (!studentId || !note) {
    res.status(400)
    throw new Error('Please provide studentId and note content')
  }

  const newNote = await db.insert(studentNotes).values({
    studentId,
    note,
    date: date || new Date()
  }).returning()

  res.status(201).json(newNote[0])
})

// @desc    Update student note
// @route   PUT /api/student-notes/:id
// @access  Private/Admin
const updateStudentNote = asyncHandler(async (req, res) => {
  
  const existingNote = await db.query.studentNotes.findFirst({
    where: eq(studentNotes.id, parseInt(req.params.studentNoteId))
  })

  if (!existingNote) {
    res.status(404)
    throw new Error('Note not found')
  }

  const updatedNote = await db.update(studentNotes)
    .set(req.body)
    .where(eq(studentNotes.id, parseInt(req.params.studentNoteId)))
    .returning()

  res.status(200).json(updatedNote[0])
})

// @desc    Delete student note
// @route   DELETE /api/student-notes/:id
// @access  Private/Admin
const deleteStudentNote = asyncHandler(async (req, res) => {
  const existingNote = await db.query.studentNotes.findFirst({
    where: eq(studentNotes.id, parseInt(req.params.studentNoteId))
  })

  if (!existingNote) {
    res.status(404)
    throw new Error('Note not found')
  }

  await db.delete(studentNotes).where(eq(studentNotes.id, parseInt(req.params.studentNoteId)))

  res.status(200).json({ id: parseInt(req.params.studentNoteId) })
})

module.exports = {
  getStudentNotes,
  getStudentNote,
  createStudentNote,
  updateStudentNote,
  deleteStudentNote
}
