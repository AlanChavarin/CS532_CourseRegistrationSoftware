const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { transferCredits } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all transfer credits
// @route   GET /api/transfer-credits
// @access  Public
const getTransferCredits = asyncHandler(async (req, res) => {
  const allTransferCredits = await db.query.transferCredits.findMany({
    with: {
      student: true,
      course: true
    }
  })
  res.status(200).json(allTransferCredits)
})

// @desc    Get single transfer credit
// @route   GET /api/transfer-credits/:id
// @access  Public
const getTransferCredit = asyncHandler(async (req, res) => {
  const transferCredit = await db.query.transferCredits.findFirst({
    where: eq(transferCredits.id, parseInt(req.params.id)),
    with: {
      student: true,
      course: true
    }
  })

  if (!transferCredit) {
    res.status(404)
    throw new Error('Transfer credit not found')
  }

  res.status(200).json(transferCredit)
})

// @desc    Create new transfer credit
// @route   POST /api/transfer-credits
// @access  Private/Admin
const createTransferCredit = asyncHandler(async (req, res) => {
  const { 
    courseId, 
    studentId, 
    universityName,
    universityLocation,
    originalCourseCode,
    grade,
    semester,
    year
  } = req.body

  if (!courseId || !studentId || !universityName || !universityLocation || !originalCourseCode || !grade || !semester || !year) {
    res.status(400)
    throw new Error('Please provide all required fields')
  }

  const newTransferCredit = await db.insert(transferCredits).values({
    courseId,
    studentId,
    universityName,
    universityLocation,
    originalCourseCode,
    grade,
    semester,
    year
  }).returning()

  res.status(201).json(newTransferCredit[0])
})

// @desc    Update transfer credit
// @route   PUT /api/transfer-credits/:id
// @access  Private/Admin
const updateTransferCredit = asyncHandler(async (req, res) => {
  
  const existingTransferCredit = await db.query.transferCredits.findFirst({
    where: eq(transferCredits.id, parseInt(req.params.id))
  })

  if (!existingTransferCredit) {
    res.status(404)
    throw new Error('Transfer credit not found')
  }

  const updatedTransferCredit = await db.update(transferCredits)
    .set(req.body)
    .where(eq(transferCredits.id, parseInt(req.params.id)))
    .returning()

  res.status(200).json(updatedTransferCredit[0])
})

// @desc    Delete transfer credit
// @route   DELETE /api/transfer-credits/:id
// @access  Private/Admin
const deleteTransferCredit = asyncHandler(async (req, res) => {
  const existingTransferCredit = await db.query.transferCredits.findFirst({
    where: eq(transferCredits.id, parseInt(req.params.id))
  })

  if (!existingTransferCredit) {
    res.status(404)
    throw new Error('Transfer credit not found')
  }

  await db.delete(transferCredits).where(eq(transferCredits.id, parseInt(req.params.id)))

  res.status(200).json({ id: parseInt(req.params.id) })
})

module.exports = {
  getTransferCredits,
  getTransferCredit,
  createTransferCredit,
  updateTransferCredit,
  deleteTransferCredit
}
