const pool = require('./db');

const createCard = async (userId, cardNumber, cardType, expiryDate, cvv, cardHolderName) => {
    const [result] = await pool.query(
        'INSERT INTO BANK_CARDS (user_id, card_number, card_type, expiry_date, cvv, card_holder_name) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, cardNumber, cardType, expiryDate, cvv, cardHolderName]
    );
    return result.insertId;
};

const findCardsByUserId = async (userId) => {
    const [rows] = await pool.query('SELECT * FROM BANK_CARDS WHERE user_id = ?', [userId]);
    // Convert balance and expense to numbers
    return rows.map(row => ({
        ...row,
        balance: parseFloat(row.balance),
        expense: parseFloat(row.expense)
    }));
};

const findCardById = async (cardId) => {
    const [rows] = await pool.query('SELECT * FROM BANK_CARDS WHERE card_id = ?', [cardId]);
    if (rows.length > 0) {
        const card = rows[0];
        return {
            ...card,
            balance: parseFloat(card.balance),
            expense: parseFloat(card.expense)
        };
    }
    return null;
};

const deleteCard = async (cardId, userId) => {
    const [result] = await pool.query(
        'DELETE FROM BANK_CARDS WHERE card_id = ? AND user_id = ?',
        [cardId, userId]
    );
    return result.affectedRows;
};

module.exports = { createCard, findCardsByUserId, findCardById, deleteCard };