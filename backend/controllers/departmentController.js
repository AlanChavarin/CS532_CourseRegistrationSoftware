const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { departments, faculty, facultyDepartmentsInvolvedIn } = require('../schema')
const { eq, and, sql } = require('drizzle-orm')

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getDepartments = asyncHandler(async (req, res) => {
  const { searchTerm } = req.query;
  let departments;

  if (searchTerm) {
    const formattedSearch = searchTerm
      .trim()
      .split(/\s+/)
      .join(' & ');

    departments = await db.query.departments.findMany({
      where: sql`to_tsvector('english', "name") @@ to_tsquery('english', ${formattedSearch})
        OR
        to_tsvector('english', "description") @@ to_tsquery('english', ${formattedSearch})`,
      with: {
        headFaculty: true,
        faculty: true,
        courses: true
      }
    });
  } else {
    departments = await db.query.departments.findMany({
      with: {
        headFaculty: true,
        faculty: true,
        courses: true
      }
    });
  }
  res.status(200).json(departments);
})

// @desc    Get single department
// @route   GET /api/departments/:id
// @access  Public
const getDepartment = asyncHandler(async (req, res) => {
  const department = await db.query.departments.findFirst({
    where: eq(departments.id, parseInt(req.params.departmentId)),
    with: {
      headFaculty: true,
      faculty: true,
      courses: true
    }
  })

  if (!department) {
    res.status(404)
    throw new Error('Department not found')
  }

  res.status(200).json(department)
})

// @desc    Create new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = asyncHandler(async (req, res) => {
  const { name, description, headFacultyId } = req.body

  if (!name) {
    res.status(400)
    throw new Error('Please add a department name')
  }

  const department = await db.insert(departments).values({
    name,
    description,
    headFacultyId: headFacultyId || null
  }).returning()

  res.status(201).json(department[0])
})

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = asyncHandler(async (req, res) => {
  const department = await db.query.departments.findFirst({
    where: eq(departments.id, parseInt(req.params.departmentId))
  })

  if (!department) {
    res.status(404)
    throw new Error('Department not found')
  }

  const updatedDepartment = await db.update(departments)
    .set(req.body)
    .where(eq(departments.id, parseInt(req.params.departmentId)))
    .returning()

  res.status(200).json(updatedDepartment[0])
})

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await db.query.departments.findFirst({
    where: eq(departments.id, parseInt(req.params.departmentId))
  })

  if (!department) {
    res.status(404)
    throw new Error('Department not found')
  }

  await db.delete(departments).where(eq(departments.id, parseInt(req.params.departmentId)))

  res.status(200).json({ id: req.params.departmentId })
})

// @desc    Add faculty to department
// @route   POST /api/departments/:id/faculty/:facultyId
// @access  Private/Admin
const addFacultyToDepartment = asyncHandler(async (req, res) => {
  const departmentId = parseInt(req.params.departmentId)
  const facultyId = parseInt(req.params.facultyId)

  // Check if department exists
  const department = await db.query.departments.findFirst({
    where: eq(departments.id, departmentId)
  })

  if (!department) {
    res.status(404)
    throw new Error('Department not found')
  }

  // Check if faculty exists
  const facultyMember = await db.query.faculty.findFirst({
    where: eq(faculty.id, facultyId)
  })

  if (!facultyMember) {
    res.status(404)
    throw new Error('Faculty member not found')
  }

  // Check if relationship already exists
  const existingRelation = await db.query.facultyDepartmentsInvolvedIn.findFirst({
    where: and(
      eq(facultyDepartmentsInvolvedIn.facultyId, facultyId),
      eq(facultyDepartmentsInvolvedIn.departmentId, departmentId)
    )
  })

  if (existingRelation) {
    res.status(400)
    throw new Error('Faculty member already in department')
  }

  // Create relationship
  await db.insert(facultyDepartmentsInvolvedIn).values({
    facultyId,
    departmentId
  })

  res.status(200).json({ message: 'Faculty added to department' })
})

// @desc    Remove faculty from department
// @route   DELETE /api/departments/:id/faculty/:facultyId
// @access  Private/Admin
const removeFacultyFromDepartment = asyncHandler(async (req, res) => {
  const departmentId = parseInt(req.params.departmentId)
  const facultyId = parseInt(req.params.facultyId)

  const relation = await db.query.facultyDepartmentsInvolvedIn.findFirst({
    where: and(
      eq(facultyDepartmentsInvolvedIn.facultyId, facultyId),
      eq(facultyDepartmentsInvolvedIn.departmentId, departmentId)
    )
  })

  if (!relation) {
    res.status(404)
    throw new Error('Faculty not found in department')
  }

  await db.delete(facultyDepartmentsInvolvedIn)
    .where(and(
      eq(facultyDepartmentsInvolvedIn.facultyId, facultyId),
      eq(facultyDepartmentsInvolvedIn.departmentId, departmentId)
    ))

  res.status(200).json({ message: 'Faculty removed from department' })
})

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addFacultyToDepartment,
  removeFacultyFromDepartment
}
