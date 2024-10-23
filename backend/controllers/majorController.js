const asyncHandler = require('express-async-handler')

// Get all majors
const getMajors = asyncHandler(async (req, res) => {
    const dummyMajors = [
        { id: 1, name: 'Computer Science' },
        { id: 2, name: 'Mathematics' },
        { id: 3, name: 'Physics' }
    ];
    res.status(200).json(dummyMajors);
});

const getMajor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would fetch the major from a database
    // For now, we'll use a dummy major
    const dummyMajor = { id: parseInt(id), name: 'Computer Science' };
    
    if (!dummyMajor) {
        res.status(404);
        throw new Error('Major not found');
    }
    
    res.status(200).json(dummyMajor);
})

// Create a new major
const createMajor = asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Please provide a name for the major');
    }
    const newMajor = { id: Date.now(), name };
    res.status(201).json(newMajor);
});

// Update a major
const updateMajor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Please provide a name for the major');
    }
    const updatedMajor = { id: parseInt(id), name };
    res.status(200).json(updatedMajor);
});

// Delete a major
const deleteMajor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would delete the major from the database here
    res.status(200).json({ message: `Major with id ${id} deleted successfully` });
});

module.exports = {
    getMajors,
    getMajor,
    createMajor,
    updateMajor,
    deleteMajor
};
