const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { dates } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all dates
// @route   GET /api/dates
// @access  Public
const getDates = asyncHandler(async (req, res) => {
  const allDates = await db.query.dates.findMany()
  res.status(200).json(allDates)
})

// @desc    Get single date
// @route   GET /api/dates/:id
// @access  Public
const getDate = asyncHandler(async (req, res) => {
  const date = await db.query.dates.findFirst({
    where: eq(dates.id, parseInt(req.params.id))
  })

  if (!date) {
    res.status(404)
    throw new Error('Date not found')
  }

  res.status(200).json(date)
})

// @desc    Create new date
// @route   POST /api/dates
// @access  Private/Admin
const createDate = asyncHandler(async (req, res) => {
  const { date, description } = req.body

  if (!date) {
    res.status(400)
    throw new Error('Please provide a date')
  }

  const newDate = await db.insert(dates).values({
    date,
    description: description || null
  }).returning()

  res.status(201).json(newDate[0])
})

// @desc    Update date
// @route   PUT /api/dates/:id
// @access  Private/Admin
const updateDate = asyncHandler(async (req, res) => {
  const { date, description } = req.body
  
  const existingDate = await db.query.dates.findFirst({
    where: eq(dates.id, parseInt(req.params.id))
  })

  if (!existingDate) {
    res.status(404)
    throw new Error('Date not found')
  }

  const updatedDate = await db.update(dates)
    .set({
      date: date || existingDate.date,
      description: description || existingDate.description
    })
    .where(eq(dates.id, parseInt(req.params.id)))
    .returning()

  res.status(200).json(updatedDate[0])
})

// @desc    Delete date
// @route   DELETE /api/dates/:id
// @access  Private/Admin
const deleteDate = asyncHandler(async (req, res) => {
  const existingDate = await db.query.dates.findFirst({
    where: eq(dates.id, parseInt(req.params.id))
  })

  if (!existingDate) {
    res.status(404)
    throw new Error('Date not found')
  }

  await db.delete(dates).where(eq(dates.id, parseInt(req.params.id)))

  res.status(200).json({ id: parseInt(req.params.id) })
})

module.exports = {
  getDates,
  getDate,
  createDate,
  updateDate,
  deleteDate
}
