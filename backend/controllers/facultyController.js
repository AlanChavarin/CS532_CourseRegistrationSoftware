const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { faculty, users } = require('../schema')
const { eq, sql } = require('drizzle-orm')

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Public
const getFaculty = asyncHandler(async (req, res) => {
  const { searchTerm } = req.query;
  let faculty;

  if (searchTerm) {
    const formattedSearch = searchTerm
      .trim()
      .split(/\s+/)
      .join(' & ');

    faculty = await db.query.faculty.findMany({
      with: {
        mainDepartment: true
      },
      where: sql`
        to_tsvector('english', "name") @@ to_tsquery('english', ${formattedSearch})
        OR
        to_tsvector('english', "position_title") @@ to_tsquery('english', ${formattedSearch})
      `
    });
  } else {
    faculty = await db.query.faculty.findMany({
      with: {
        mainDepartment: true
      }
    });
  }
  res.status(200).json(faculty);
});


// @desc    Get single faculty member
// @route   GET /api/faculty/:id
// @access  Public
const getFacultyMember = asyncHandler(async (req, res) => {
  const facultyId = req.params.facultyid;

  if (!facultyId) {
    res.status(400)
    throw new Error('Faculty ID is required')
  }

  console.log("facultyId: ", facultyId)

  const facultyMember = await db.query.faculty.findFirst({
    where: eq(faculty.id, facultyId),
    with: {
      mainDepartment: true,
      user: true
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
  const { name, positionTitle, phoneNumber, officeNumber, mainDepartment, userEmail } = req.body

  //get the user from the email
  const user = await db.query.users.findFirst({
    where: eq(users.email, userEmail)
  })

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (!name || !userEmail) {
    res.status(400)
    throw new Error('Please provide name and userEmail for the faculty member')
  }

  // Check if faculty with email already exists
  const existingFaculty = await db.query.faculty.findFirst({
    where: eq(faculty.userId, user.id)
  })

  if (existingFaculty) {
    res.status(400)
    throw new Error('Faculty member with this userId already exists')
  }

  const newFaculty = await db.insert(faculty).values({
    name,
    positionTitle,
    phoneNumber,
    officeNumber,
    mainDepartment: mainDepartment || null,
    userId: user.id
  }).returning()

  res.status(201).json(newFaculty[0])
})

// @desc    Update faculty member
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFacultyMember = asyncHandler(async (req, res) => {
  const facultyId = parseInt(req.params.id)
  const { name, positionTitle, phoneNumber, officeNumber, mainDepartment, userId } = req.body

  const existingFaculty = await db.query.faculty.findFirst({
    where: eq(faculty.id, facultyId)
  })

  if (!existingFaculty) {
    res.status(404)
    throw new Error('Faculty member not found')
  }

  // Check if updating email and if it conflicts with another faculty
  if (userId && userId !== existingFaculty.userId) {
    const userIdExists = await db.query.faculty.findFirst({
      where: eq(faculty.userId, userId)
    })

    if (emailExists) {
      res.status(400)
      throw new Error('UserId already in use by another faculty member')
    }
  }

  const updatedFaculty = await db.update(faculty)
    .set({
      name: name || existingFaculty.name,
      positionTitle: positionTitle || existingFaculty.positionTitle,
      phoneNumber: phoneNumber || existingFaculty.phoneNumber,
      officeNumber: officeNumber || existingFaculty.officeNumber,
      mainDepartment: mainDepartment || existingFaculty.mainDepartment
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
