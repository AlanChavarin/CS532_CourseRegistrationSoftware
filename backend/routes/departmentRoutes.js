const express = require('express')
const router = express.Router()
const {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentsController')

// Get all departments
router.route('/').get(getDepartments)

// Create a new department 
router.route('/').post(createDepartment)

// Get a single department
router.route('/:id').get(getDepartment)

// Update a department
router.route('/:id').put(updateDepartment)

// Delete a department
router.route('/:id').delete(deleteDepartment)

module.exports = router
