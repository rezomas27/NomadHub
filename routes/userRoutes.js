const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Ensure the correct path to your User model

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;  // Get the token from cookies
        if (!token) {
            console.log('No token found, redirecting to login');
            return res.redirect('/login');  // Redirect to login if no token is found
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);  // Find user by ID
        if (!req.user) {
            console.log('User not found, redirecting to login');
            return res.redirect('/login');  // Redirect to login if user not found
        }

        console.log('Token is valid, proceeding to next middleware');
        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.log('Error verifying token:', err);
        res.redirect('/login');  // Redirect to login on token verification failure
    }
};

// Login routes
router.get('/login', userController.user_login_get);
router.post('/login', userController.user_login_post);

// Signup routes
router.get('/signup', userController.user_signup_get);
router.post('/signup', userController.user_signup_post);

// Protected routes
router.get('/myAccount', authMiddleware, userController.user_myAccount_get);

module.exports = router;