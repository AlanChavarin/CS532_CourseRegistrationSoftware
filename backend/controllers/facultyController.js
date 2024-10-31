const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { faculty, departments, facultyDepartmentsInvolvedIn } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
const getFaculty = asyncHandler(async (req, res) => {
  const allFaculty = await db.query.faculty.findMany({
    with: {
      departments: {
        with: {
          department: true
        }
      }
    }
  })
  res.status(200).json(allFaculty)
})

// @desc    Get single faculty member
// @route   GET /api/faculty/:id
// @access  Public
const getFacultyMember = asyncHandler(async (req, res) => {
  const facultyMember = await db.query.faculty.findFirst({
    where: eq(faculty.id, parseInt(req.params.id)),
    with: {
      departments: {
        with: {
          department: true
        }
      }
    }
  })

  if (!facultyMember) {
    res.status(404)
    throw new Error('Faculty member not found')
  }

  res.status(200).json(facultyMember)
})

// @desc    Create new faculty member
// @route   POST /api/faculty
// @access  Private/Admin
const createFacultyMember = asyncHandler(async (req, res) => {
  const { name, email, officeLocation, phoneNumber } = req.body

  if (!name || !email) {
    res.status(400)
    throw new Error('Please provide name and email for the faculty member')
  }

  // Check if faculty with email already exists
  const existingFaculty = await db.query.faculty.findFirst({
    where: eq(faculty.email, email)
  })

  if (existingFaculty) {
    res.status(400)
    throw new Error('Faculty member with this email already exists')
  }

  const newFaculty = await db.insert(faculty).values({
    name,
    email,
    officeLocation,
    phoneNumber
  }).returning()

  res.status(201).json(newFaculty[0])
})

// @desc    Update faculty member
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFacultyMember = asyncHandler(async (req, res) => {
  const facultyId = parseInt(req.params.id)
  const { name, email, officeLocation, phoneNumber } = req.body

  const existingFaculty = await db.query.faculty.findFirst({
    where: eq(faculty.id, facultyId)
  })

  if (!existingFaculty) {
    res.status(404)
    throw new Error('Faculty member not found')
  }

  // Check if updating email and if it conflicts with another faculty
  if (email && email !== existingFaculty.email) {
    const emailExists = await db.query.faculty.findFirst({
      where: eq(faculty.email, email)
    })

    if (emailExists) {
      res.status(400)
      throw new Error('Email already in use by another faculty member')
    }
  }

  const updatedFaculty = await db.update(faculty)
    .set({
      name: name || existingFaculty.name,
      email: email || existingFaculty.email,
      officeLocation: officeLocation || existingFaculty.officeLocation,
      phoneNumber: phoneNumber || existingFaculty.phoneNumber
    })
    .where(eq(faculty.id, facultyId))
    .returning()

  res.status(200).json(updatedFaculty[0])
})

// @desc    Delete faculty member
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFacultyMember = asyncHandler(async (req, res) => {
  const facultyId = parseInt(req.params.id)

  const existingFaculty = await db.query.faculty.findFirst({
    where: eq(faculty.id, facultyId)
  })

  if (!existingFaculty) {
    res.status(404)
    throw new Error('Faculty member not found')
  }

  await db.delete(faculty).where(eq(faculty.id, facultyId))

  res.status(200).json({ message: 'Faculty member deleted successfully' })
})

module.exports = {
  getFaculty,
  getFacultyMember,
  createFacultyMember,
  updateFacultyMember,
  deleteFacultyMember
}
