const asyncHandler = require('express-async-handler')

// Get all students
const getStudents = asyncHandler(async (req, res) => {
    const dummyStudents = [
        { id: 1, name: 'John Doe', email: 'john@example.com', major: 'Computer Science' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', major: 'Mathematics' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', major: 'Physics' }
    ];
    res.status(200).json(dummyStudents);
});

const getStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would fetch the student from a database
    // For now, we'll use a dummy student
    const dummyStudent = { id: parseInt(id), name: 'John Doe', email: 'john@example.com', major: 'Computer Science' };
    
    if (!dummyStudent) {
        res.status(404);
        throw new Error('Student not found');
    }
    
    res.status(200).json(dummyStudent);
})

// Create a new student
const createStudent = asyncHandler(async (req, res) => {
    const { name, email, major } = req.body;
    if (!name || !email || !major) {
        res.status(400);
        throw new Error('Please provide a name, email, and major for the student');
    }
    const newStudent = { id: Date.now(), name, email, major };
    res.status(201).json(newStudent);
});

// Update a student
const updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, major } = req.body;
    if (!name || !email || !major) {
        res.status(400);
        throw new Error('Please provide a name, email, and major for the student');
    }
    const updatedStudent = { id: parseInt(id), name, email, major };
    res.status(200).json(updatedStudent);
});

// Delete a student
const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would delete the student from the database here
    res.status(200).json({ message: `Student with id ${id} deleted successfully` });
});

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};
