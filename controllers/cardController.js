const Joi = require('joi');
const { createCard, findCardsByUserId } = require('../models/cardModel');

const cardSchema = Joi.object({
    cardHolderName: Joi.string().min(3).max(100).required(),
    cardNumber: Joi.string().length(16).pattern(/^[0-9]+$/).required(),
    expiryDate: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).required(), // MM/YY format
    cvv: Joi.string().pattern(/^[0-9]{3,4}$/).required(),
    cardType: Joi.string().valid('visa', 'mastercard', 'amex').required()
});

const addCard = async (req, res) => {
    const { error } = cardSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { cardHolderName, cardNumber, expiryDate, cvv, cardType } = req.body;
    const userId = req.session.userId;

    try {
        const existingCard = await findCardsByUserId(userId);
        if (existingCard.some(card => card.card_number === cardNumber)) {
            return res.status(409).json({ message: 'Card number already exists' });
        }

        const cardId = await createCard(userId, cardNumber, cardType, expiryDate, cvv, cardHolderName);
        res.status(201).json({ message: 'Card added successfully', cardId });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Card number already exists' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserCards = async (req, res) => {
    const userId = req.session.userId;
    try {
        const cards = await findCardsByUserId(userId);
        res.status(200).json({ cards });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addCard, getUserCards };