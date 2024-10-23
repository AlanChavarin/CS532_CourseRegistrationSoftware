const asyncHandler = require('express-async-handler')

// Get all faculty
const getFaculty = asyncHandler(async (req, res) => {
    const dummyFaculty = [
        { id: 1, name: 'Dr. John Doe', email: 'john@example.com', department: 'Computer Science' },
        { id: 2, name: 'Prof. Jane Smith', email: 'jane@example.com', department: 'Mathematics' },
        { id: 3, name: 'Dr. Bob Johnson', email: 'bob@example.com', department: 'Physics' }
    ];
    res.status(200).json(dummyFaculty);
});

const getFacultyMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would fetch the faculty member from a database
    // For now, we'll use a dummy faculty member
    const dummyFacultyMember = { id: parseInt(id), name: 'Dr. John Doe', email: 'john@example.com', department: 'Computer Science' };
    
    if (!dummyFacultyMember) {
        res.status(404);
        throw new Error('Faculty member not found');
    }
    
    res.status(200).json(dummyFacultyMember);
})

// Create a new faculty member
const createFacultyMember = asyncHandler(async (req, res) => {
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
        res.status(400);
        throw new Error('Please provide a name, email, and department for the faculty member');
    }
    const newFacultyMember = { id: Date.now(), name, email, department };
    res.status(201).json(newFacultyMember);
});

// Update a faculty member
const updateFacultyMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
        res.status(400);
        throw new Error('Please provide a name, email, and department for the faculty member');
    }
    const updatedFacultyMember = { id: parseInt(id), name, email, department };
    res.status(200).json(updatedFacultyMember);
});

// Delete a faculty member
const deleteFacultyMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would delete the faculty member from the database here
    res.status(200).json({ message: `Faculty member with id ${id} deleted successfully` });
});

module.exports = {
    getFaculty,
    getFacultyMember,
    createFacultyMember,
    updateFacultyMember,
    deleteFacultyMember
};
