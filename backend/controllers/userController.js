const asyncHandler = require('express-async-handler')
const { db } = require('../db')
const { users } = require('../schema')
const { eq } = require('drizzle-orm')

// @desc    Get all users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
    const allUsers = await db.query.users.findMany();
    res.status(200).json(allUsers);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
    const user = await db.query.users.findFirst({
        where: eq(users.id, parseInt(req.params.id))
    });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    
    res.status(200).json(user);
});

// @desc    Create new user
// @route   POST /api/users
// @access  Public
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email, and password');
    }

    // Check if user with email already exists
    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (existingUser) {
        res.status(400);
        throw new Error('User with this email already exists');
    }

    const newUser = await db.insert(users).values({
        name,
        email,
        password
    }).returning();

    res.status(201).json(newUser[0]);
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const user = await db.query.users.findFirst({
        where: eq(users.email, email)
    });

    if (!user || user.password !== password) { // In production, use proper password hashing
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // In production, generate proper JWT token
    res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: 'jwt_token_here'
    });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        res.status(400);
        throw new Error('Please provide name and email');
    }

    const updatedUser = await db.update(users)
        .set({
            name,
            email
        })
        .where(eq(users.id, parseInt(req.params.id)))
        .returning();

    if (!updatedUser.length) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(updatedUser[0]);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await db.delete(users)
        .where(eq(users.id, parseInt(req.params.id)))
        .returning();

    if (!deletedUser.length) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = {
    getUsers,
    getUser,
    createUser,
    loginUser,
    updateUser,
    deleteUser
};
