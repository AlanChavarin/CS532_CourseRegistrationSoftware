const asyncHandler = require('express-async-handler')

// Get all courses
const getCourses = asyncHandler(async (req, res) => {
    const dummyCourses = [
        { id: 1, name: 'Introduction to Programming', code: 'CS101' },
        { id: 2, name: 'Data Structures', code: 'CS201' },
        { id: 3, name: 'Algorithms', code: 'CS301' }
    ];
    res.status(200).json(dummyCourses);
});

const getCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would fetch the course from a database
    // For now, we'll use a dummy course
    const dummyCourse = { id: parseInt(id), name: 'Introduction to Programming', code: 'CS101' };
    
    if (!dummyCourse) {
        res.status(404);
        throw new Error('Course not found');
    }
    
    res.status(200).json(dummyCourse);
})

// Create a new course
const createCourse = asyncHandler(async (req, res) => {
    const { name, code } = req.body;
    if (!name || !code) {
        res.status(400);
        throw new Error('Please provide a name and code for the course');
    }
    const newCourse = { id: Date.now(), name, code };
    res.status(201).json(newCourse);
});

// Update a course
const updateCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;
    if (!name || !code) {
        res.status(400);
        throw new Error('Please provide a name and code for the course');
    }
    const updatedCourse = { id: parseInt(id), name, code };
    res.status(200).json(updatedCourse);
});

// Delete a course
const deleteCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would delete the course from the database here
    res.status(200).json({ message: `Course with id ${id} deleted successfully` });
});

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};
