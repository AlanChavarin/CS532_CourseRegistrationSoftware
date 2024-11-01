const express = require('express')
const router = express.Router()
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  addFacultyToDepartment,
  removeFacultyFromDepartment
} = require('../controllers/departmentController')

// Get all departments
router.route('/').get(getDepartments)

// Create a new department 
router.route('/').post(createDepartment)

// Get a single department
router.route('/:departmentId').get(getDepartment)

// Update a department
router.route('/:departmentId').put(updateDepartment)

// Delete a department
router.route('/:departmentId').delete(deleteDepartment)

// Add faculty to department
router.route('/:departmentId/addFaculty/:facultyId').post(addFacultyToDepartment)

// Remove faculty from department
router.route('/:departmentId/removeFaculty/:facultyId').delete(removeFacultyFromDepartment)

module.exports = router
