const express = require('express')
const router = express.Router()
const {
  getDates,
  getDate,
  createDate,
  updateDate,
  deleteDate
} = require('../controllers/dateController')

router.route('/').get(getDates)
router.route('/').post(createDate)
router.route('/:id').get(getDate)
router.route('/:id').put(updateDate)
router.route('/:id').delete(deleteDate)

module.exports = router
