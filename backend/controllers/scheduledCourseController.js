const asyncHandler = require('express-async-handler')

// Get all scheduled courses
const getScheduledCourses = asyncHandler(async (req, res) => {
    const dummyScheduledCourses = [
        { id: 1, name: 'Introduction to Programming', code: 'CS101', professor: 'Dr. Smith', room: 'A101', startTime: '09:00', endTime: '10:30' },
        { id: 2, name: 'Data Structures', code: 'CS201', professor: 'Dr. Johnson', room: 'B202', startTime: '11:00', endTime: '12:30' },
        { id: 3, name: 'Algorithms', code: 'CS301', professor: 'Dr. Brown', room: 'C303', startTime: '14:00', endTime: '15:30' }
    ];
    res.status(200).json(dummyScheduledCourses);
});

const getScheduledCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would fetch the scheduled course from a database
    // For now, we'll use a dummy scheduled course
    const dummyScheduledCourse = { id: parseInt(id), name: 'Introduction to Programming', code: 'CS101', professor: 'Dr. Smith', room: 'A101', startTime: '09:00', endTime: '10:30' };
    
    if (!dummyScheduledCourse) {
        res.status(404);
        throw new Error('Scheduled course not found');
    }
    
    res.status(200).json(dummyScheduledCourse);
})

// Create a new scheduled course
const createScheduledCourse = asyncHandler(async (req, res) => {
    const { name, code, professor, room, startTime, endTime } = req.body;
    if (!name || !code || !professor || !room || !startTime || !endTime) {
        res.status(400);
        throw new Error('Please provide all required fields for the scheduled course');
    }
    const newScheduledCourse = { id: Date.now(), name, code, professor, room, startTime, endTime };
    res.status(201).json(newScheduledCourse);
});

// Update a scheduled course
const updateScheduledCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, code, professor, room, startTime, endTime } = req.body;
    if (!name || !code || !professor || !room || !startTime || !endTime) {
        res.status(400);
        throw new Error('Please provide all required fields for the scheduled course');
    }
    const updatedScheduledCourse = { id: parseInt(id), name, code, professor, room, startTime, endTime };
    res.status(200).json(updatedScheduledCourse);
});

// Delete a scheduled course
const deleteScheduledCourse = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would delete the scheduled course from the database here
    res.status(200).json({ message: `Scheduled course with id ${id} deleted successfully` });
});

module.exports = {
    getScheduledCourses,
    getScheduledCourse,
    createScheduledCourse,
    updateScheduledCourse,
    deleteScheduledCourse
};
