const express = require('express');
const { signup, login, logout } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/protected', isAuthenticated, (req, res) => {
    res.status(200).json({ message: 'You are authenticated' });
});
router.get('/session', (req, res) => {
    if (req.session.userId) {
        res.status(200).json({
            loggedIn: true,
            userId: req.session.userId
        });
    } else {
        res.status(200).json({
            loggedIn: false,
            message: 'No active session'
        });
    }
});

module.exports = router;