const asyncHandler = require('express-async-handler')

// Get all users
const getUsers = asyncHandler(async (req, res) => {
    const dummyUsers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ];
    res.status(200).json(dummyUsers);
});

const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would fetch the user from a database
    // For now, we'll use a dummy user
    const dummyUser = { id: parseInt(id), name: 'John Doe', email: 'john@example.com' };
    
    if (!dummyUser) {
        res.status(404);
        throw new Error('User not found');
    }
    
    res.status(200).json(dummyUser);
})

// Create a new user
const createUser = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400);
        throw new Error('Please provide a name and email for the user');
    }
    const newUser = { id: Date.now(), name, email };
    res.status(201).json(newUser);
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    // In a real application, you would verify the user's credentials against a database
    // For now, we'll use a dummy successful login
    const dummyUser = { id: 1, name: 'John Doe', email: 'john@example.com' };

    if (email === dummyUser.email && password === 'password123') {
        res.status(200).json({
            id: dummyUser.id,
            name: dummyUser.name,
            email: dummyUser.email,
            token: 'dummy_jwt_token'
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});


// Update a user
const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400);
        throw new Error('Please provide a name and email for the user');
    }
    const updatedUser = { id: parseInt(id), name, email };
    res.status(200).json(updatedUser);
});

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // In a real application, you would delete the user from the database here
    res.status(200).json({ message: `User with id ${id} deleted successfully` });
});

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
};
