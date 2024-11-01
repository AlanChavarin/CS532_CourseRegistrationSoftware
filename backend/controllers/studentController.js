const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { students } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = asyncHandler(async (req, res) => {
    const allStudents = await db.query.students.findMany();
    res.status(200).json(allStudents);
});

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Public
const getStudent = asyncHandler(async (req, res) => {
    const student = await db.query.students.findFirst({
        where: eq(students.id, parseInt(req.params.studentId)),
    });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }
    
    res.status(200).json(student);
});

// @desc    Create new student
// @route   POST /api/students
// @access  Private/Admin
const createStudent = asyncHandler(async (req, res) => {
    const { name, majorId, minorId, userId, GPA, address, dateOfBirth } = req.body;

    if (!name || !majorId || !userId) {
        res.status(400);
        throw new Error('Please provide name, userId, and majorId for the student');
    }

    // Check if student with email already exists
    const existingStudent = await db.query.students.findFirst({
        where: eq(students.userId, userId)
    });

    if (existingStudent) {
        res.status(400);
        throw new Error('Student with this email already exists');
    }

    const newStudent = await db.insert(students).values({
        name,
        majorId,
        minorId,
        userId,
        GPA,
        address,
        dateOfBirth
    }).returning();

    res.status(201).json(newStudent[0]);
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = asyncHandler(async (req, res) => {

    console.log(req.body)

    const student = await db.query.students.findFirst({
        where: eq(students.id, parseInt(req.params.studentId))
    });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    const updatedStudent = await db.update(students)
        .set(req.body)
        .where(eq(students.id, parseInt(req.params.studentId)))
        .returning();

    res.status(200).json(updatedStudent[0]);
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await db.query.students.findFirst({
        where: eq(students.id, parseInt(req.params.studentId))
    });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    await db.delete(students)
        .where(eq(students.id, parseInt(req.params.studentId)));

    res.status(200).json({ message: `Student with id ${req.params.studentId} deleted successfully` });
});

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};
