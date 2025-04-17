const express = require('express');
const { addCard, getUserCards, removeCard } = require('../controllers/cardController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new card (protected)
router.post('/add', isAuthenticated, addCard);

// Get all cards for the logged-in user (protected)
router.get('/user', isAuthenticated, getUserCards);

// Remove a card (protected)
router.post('/remove', isAuthenticated, removeCard);

module.exports = router;