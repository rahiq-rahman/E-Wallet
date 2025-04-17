const pool = require('./db');

const findTransactionsByUserId = async (userId, page, limit) => {
    const offset = (page - 1) * limit;
    try {
        const [transactions] = await pool.query(
            `SELECT t.transaction_id, s.service_type, t.amount, t.created_at, t.card_id, t.status
             FROM TRANSACTION t
             JOIN SERVICE s ON t.service_id = s.service_id
             WHERE t.user_id = ?
             ORDER BY t.created_at DESC
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        const [[{ total }]] = await pool.query(
            'SELECT COUNT(*) as total FROM TRANSACTION WHERE user_id = ?',
            [userId]
        );

        return {
            transactions: transactions.map(t => ({
                ...t,
                amount: parseFloat(t.amount)
            })),
            total
        };
    } catch (err) {
        throw err;
    }
};

module.exports = { findTransactionsByUserId };