const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { majors } = require('../schema')
const { eq, sql } = require('drizzle-orm')

// @desc    Get all majors
// @route   GET /api/majors
// @access  Public
const getMajors = asyncHandler(async (req, res) => {
  const { searchTerm, departmentId } = req.query;

  let result;

  if (departmentId)  {
    result = await db.query.majors.findMany({
      where: eq(majors.departmentId, departmentId),
      with: {
        department: true,
      }
    });
  } else if (searchTerm) {
    const formattedSearch = searchTerm
      .trim()
      .split(/\s+/)
      .join(' & ');

    result = await db.query.majors.findMany({
      with: {
        department: true,
      },
      where: sql`to_tsvector('english', ${majors.title}) @@ to_tsquery('english', ${formattedSearch})`
    });
  } else {
    result = await db.query.majors.findMany({
      with: {
        department: true,
      }
    });
  }

  res.status(200).json(result)
})

// @desc    Get single major
// @route   GET /api/majors/:id
// @access  Public
const getMajor = asyncHandler(async (req, res) => {
  const majorId = Number(req.params.majorId)

  if (isNaN(majorId)) {
    res.status(400)
    throw new Error('Invalid major ID format')
  }

  const major = await db.query.majors.findFirst({
    where: eq(majors.id, majorId),
    with: {
      department: true,
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
  const { title, departmentId, description, requiredUnits } = req.body

  if (!title || !requiredUnits) {
    res.status(400)
    throw new Error('Please provide a title and required units for the major')
  }

  const major = await db.insert(majors).values({
    title,
    departmentId,
    description: description || null,
    requiredUnits: requiredUnits || 0
  }).returning()

  res.status(201).json(major[0])
})

// @desc    Update major
// @route   PUT /api/majors/:id
// @access  Private/Admin
const updateMajor = asyncHandler(async (req, res) => {

  const major = await db.query.majors.findFirst({
    where: eq(majors.id, parseInt(req.params.majorId))
  })

  if (!major) {
    res.status(404)
    throw new Error('Major not found')
  }

  const updatedMajor = await db.update(majors)
    .set(req.body)
    .where(eq(majors.id, parseInt(req.params.majorId)))
    .returning()

  res.status(200).json(updatedMajor[0])
})

// @desc    Delete major
// @route   DELETE /api/majors/:id
// @access  Private/Admin
const deleteMajor = asyncHandler(async (req, res) => {
  const major = await db.query.majors.findFirst({
    where: eq(majors.id, parseInt(req.params.majorId))
  })

  if (!major) {
    res.status(404)
    throw new Error('Major not found')
  }

  await db.delete(majors)
    .where(eq(majors.id, parseInt(req.params.majorId)))

  res.status(200).json({ message: 'Major deleted successfully' })
})

module.exports = {
  getMajors,
  getMajor,
  createMajor,
  updateMajor,
  deleteMajor
}
