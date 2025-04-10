const express = require('express');
const path = require('path');
const {isAuthenticated} = require("../middleware/authMiddleware");
const { findById } = require('../models/userModel');


const router = express.Router();

// Root route (entry point)
router.get('/', (req, res) => {
    if (req.session.userId) {
        // If user is logged in, redirect to home
        res.redirect('/home');
    } else {
        // If user is not logged in, show login page
        res.sendFile(path.join(__dirname, '../template', 'login.html'));
    }
});

// Route for login page (no authentication required)
router.get('/login', (req, res) => {
    if (req.session.userId) {
        // If user is already logged in, redirect to home
        res.redirect('/home');
    } else {
        res.sendFile(path.join(__dirname, '../template', 'login.html'));
    }
});

// Route for signup page (no authentication required)
router.get('/signup', (req, res) => {
    if (req.session.userId) {
        // If user is already logged in, redirect to home
        res.redirect('/home');
    } else {
        res.sendFile(path.join(__dirname, '../template', 'signup.html'));
    }
});

// Route for home page (protected)
router.get('/home', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../template', 'home.html'));
});

// Route for profile page (protected)
router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        const user = await findById(req.session.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile', {
            userId: user.user_id,
            username: user.username,
            email: user.email,
            phone_no: user.phone_no,
            nid: user.nid,
            created_at: user.created_at,
            updated_at: user.updated_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Routes for service pages (protected)
router.get('/electricity', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../template/services', 'electricity.html'));
});

router.get('/gas', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../template/services', 'gas.html'));
});

router.get('/internet', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, '../template/services', 'internet.html'));
});

module.exports = router;