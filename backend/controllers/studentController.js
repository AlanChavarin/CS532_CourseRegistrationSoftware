const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { students, users } = require('../schema')
const { eq, sql } = require('drizzle-orm')

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getStudents = asyncHandler(async (req, res) => {
    const { searchTerm } = req.query;
    let students;

    if (searchTerm) {
        const formattedSearch = searchTerm
            .trim()
            .split(/\s+/)
            .join(' & ');

        students = await db.query.students.findMany({
            with: {
                major: true,
                minor: true
            },  
            where: sql`
                to_tsvector('english', "name") @@ to_tsquery('english', ${formattedSearch})
                OR
                to_tsvector('english', "address") @@ to_tsquery('english', ${formattedSearch})
            `
        });
    } else {
        students = await db.query.students.findMany({
            with: {
                major: true,
                minor: true
            }
        });
    }
    res.status(200).json(students);
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
    const { name, majorId, minorId, userEmail, GPA, address, dateOfBirth } = req.body;

    console.log("Body", req.body);
    console.log("Major ID", majorId);
    console.log("Minor ID", minorId);

    // get the user id from the user email
    const user = await db.query.users.findFirst({
        where: eq(users.email, userEmail)
    }); 

    if (!name || !majorId || !userEmail) {
        res.status(400);
        throw new Error('Please provide name, userEmail, and majorId for the student');
    }

    // Check if student with email already exists
    const existingStudent = await db.query.students.findFirst({
        where: eq(students.userId, user.id)
    });

    if (existingStudent) {
        res.status(400);
        throw new Error('Student with this email already exists');
    }

    const newStudent = await db.insert(students).values({
        name,
        majorId: majorId ? majorId : null,
        minorId: minorId ? minorId : null,
        userId: user.id,
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
