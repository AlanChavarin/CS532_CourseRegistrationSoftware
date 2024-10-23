const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Get all users
router.get('/', getUsers);

// Get a single user
router.get('/:userId', getUser);

// Create a new user
router.post('/', createUser);

// Update a user
router.put('/:userId', updateUser);

// Delete a user
router.delete('/:userId', deleteUser);

module.exports = router;
