const express = require('express')
const router = express.Router()
const {
  getTransferCredits,
  getTransferCredit,
  createTransferCredit, 
  updateTransferCredit,
  deleteTransferCredit
} = require('../controllers/transferCreditsController')

// Get all transfer credits
router.route('/').get(getTransferCredits)

// Create a new transfer credit
router.route('/').post(createTransferCredit)

// Get a single transfer credit
router.route('/:id').get(getTransferCredit)

// Update a transfer credit
router.route('/:id').put(updateTransferCredit)

// Delete a transfer credit
router.route('/:id').delete(deleteTransferCredit)

module.exports = router
