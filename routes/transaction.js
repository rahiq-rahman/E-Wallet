const express = require('express');
const { getUserTransactions } = require('../controllers/transactionController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// Get transactions for the logged-in user (protected)
router.get('/', isAuthenticated, getUserTransactions);

module.exports = router;