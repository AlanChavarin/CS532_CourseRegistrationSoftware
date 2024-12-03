const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { students, users, courseWaitlist, studentScheduledCourses, scheduledCourses } = require('../schema')
const { eq, sql, desc, asc } = require('drizzle-orm')

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

// @desc    Register student for a course or add to waitlist
// @route   POST /api/students/:studentId/register
// @access  Private/Student
const registerForCourse = asyncHandler(async (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const { scheduledCourseId } = req.body;

    // Check if student exists
    const student = await db.query.students.findFirst({
        where: eq(students.id, studentId)
    });

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Check if already registered
    const existingRegistration = await db.query.studentScheduledCourses.findFirst({
        where: and(
            eq(studentScheduledCourses.studentId, studentId),
            eq(studentScheduledCourses.scheduledCourseId, scheduledCourseId)
        )
    });

    if (existingRegistration) {
        res.status(400);
        throw new Error('Already registered for this course');
    }

    // Check if already on waitlist
    const existingWaitlist = await db.query.courseWaitlist.findFirst({
        where: and(
            eq(courseWaitlist.studentId, studentId),
            eq(courseWaitlist.scheduledCourseId, scheduledCourseId)
        )
    });

    if (existingWaitlist) {
        res.status(400);
        throw new Error('Already on waitlist for this course');
    }

    // Try to register or add to waitlist
    try {
        const result = await db.transaction(async (tx) => {
            // Try to get a seat
            const updateResult = await tx.update(scheduledCourses)
                .set({ 
                    availableSeats: sql`available_seats - 1` 
                })
                .where(and(
                    eq(scheduledCourses.id, scheduledCourseId),
                    sql`available_seats > 0`
                ))
                .returning();

            // If no seats available, add to waitlist
            if (updateResult.length === 0) {
                // Get current waitlist position
                const lastPosition = await tx.query.courseWaitlist.findFirst({
                    where: eq(courseWaitlist.scheduledCourseId, scheduledCourseId),
                    orderBy: desc(courseWaitlist.position),
                });

                const position = lastPosition ? lastPosition.position + 1 : 1;

                // Add to waitlist
                const waitlistEntry = await tx.insert(courseWaitlist)
                    .values({
                        studentId,
                        scheduledCourseId,
                        position
                    })
                    .returning();

                return {
                    status: 'waitlisted',
                    data: waitlistEntry[0]
                };
            }

            // If seat available, register
            const registration = await tx.insert(studentScheduledCourses)
                .values({
                    studentId,
                    scheduledCourseId,
                    isCompleted: false
                })
                .returning();

            return {
                status: 'registered',
                data: registration[0]
            };
        });

        res.status(201).json(result);
    } catch (error) {
        throw new Error(error.message);
    }
});

// @desc    Get student's registered courses
// @route   GET /api/students/:studentId/courses
// @access  Private/Student
const getRegisteredCourses = asyncHandler(async (req, res) => {
    const studentId = parseInt(req.params.studentId);

    const registrations = await db.query.studentScheduledCourses.findMany({
        where: eq(studentScheduledCourses.studentId, studentId),
        with: {
            scheduledCourse: {
                with: {
                    course: true,
                    instructor: true,
                    dates: true
                }
            }
        }
    });

    res.status(200).json(registrations);
});

// @desc    Drop a course
// @route   DELETE /api/students/:studentId/courses/:registrationId
// @access  Private/Student
const dropCourse = asyncHandler(async (req, res) => {
    const studentId = parseInt(req.params.studentId);
    const registrationId = parseInt(req.params.registrationId);

    const result = await db.transaction(async (tx) => {
        const registration = await tx.query.studentScheduledCourses.findFirst({
            where: and(
                eq(studentScheduledCourses.id, registrationId),
                eq(studentScheduledCourses.studentId, studentId)
            )
        });

        if (!registration) {
            res.status(404);
            throw new Error('Registration not found');
        }

        // Delete registration
        await tx.delete(studentScheduledCourses)
            .where(eq(studentScheduledCourses.id, registrationId));

        // Check waitlist for next student
        const nextInLine = await tx.query.courseWaitlist.findFirst({
            where: eq(courseWaitlist.scheduledCourseId, registration.scheduledCourseId),
            orderBy: asc(courseWaitlist.position),
            with: {
                student: true
            }
        });

        if (nextInLine) {
            // Register the waitlisted student
            await tx.insert(studentScheduledCourses)
                .values({
                    studentId: nextInLine.studentId,
                    scheduledCourseId: registration.scheduledCourseId,
                    isCompleted: false
                });

            // Remove from waitlist
            await tx.delete(courseWaitlist)
                .where(eq(courseWaitlist.id, nextInLine.id));

            return { 
                message: 'Course dropped successfully',
                waitlist: `Student ${nextInLine.student.name} has been registered from waitlist`
            };
        }

        // If no waitlist, increment available seats
        await tx.update(scheduledCourses)
            .set({
                availableSeats: sql`available_seats + 1`
            })
            .where(eq(scheduledCourses.id, registration.scheduledCourseId))
            .returning();

        return { message: 'Course dropped successfully' };
    });

    res.status(200).json(result);
});

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    registerForCourse,
    getRegisteredCourses,
    dropCourse
};
