const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { majors } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all majors
// @route   GET /api/majors
// @access  Public
const getMajors = asyncHandler(async (req, res) => {
  const allMajors = await db.select().from(majors)
  res.status(200).json(allMajors)
})

// @desc    Get single major
// @route   GET /api/majors/:id
// @access  Public
const getMajor = asyncHandler(async (req, res) => {
  const major = await db.query.majors.findFirst({
    where: eq(majors.id, parseInt(req.params.id)),
    with: {
      departments: true
    }
  })

  if (!major) {
    res.status(404)
    throw new Error('Major not found')
  }

  res.status(200).json(major)
})

// @desc    Create new major
// @route   POST /api/majors
// @access  Private/Admin
const createMajor = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  if (!name) {
    res.status(400)
    throw new Error('Please provide a name for the major')
  }

  const major = await db.insert(majors).values({
    name,
    description: description || null
  }).returning()

  res.status(201).json(major[0])
})

// @desc    Update major
// @route   PUT /api/majors/:id
// @access  Private/Admin
const updateMajor = asyncHandler(async (req, res) => {
  const { name, description } = req.body

  const major = await db.query.majors.findFirst({
    where: eq(majors.id, parseInt(req.params.id))
  })

  if (!major) {
    res.status(404)
    throw new Error('Major not found')
  }

  if (!name) {
    res.status(400)
    throw new Error('Please provide a name for the major')
  }

  const updatedMajor = await db.update(majors)
    .set({
      name,
      description: description || major.description
    })
    .where(eq(majors.id, parseInt(req.params.id)))
    .returning()

  res.status(200).json(updatedMajor[0])
})

// @desc    Delete major
// @route   DELETE /api/majors/:id
// @access  Private/Admin
const deleteMajor = asyncHandler(async (req, res) => {
  const major = await db.query.majors.findFirst({
    where: eq(majors.id, parseInt(req.params.id))
  })

  if (!major) {
    res.status(404)
    throw new Error('Major not found')
  }

  await db.delete(majors)
    .where(eq(majors.id, parseInt(req.params.id)))

  res.status(200).json({ message: 'Major deleted successfully' })
})

module.exports = {
  getMajors,
  getMajor,
  createMajor,
  updateMajor,
  deleteMajor
}
