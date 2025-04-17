const Joi = require('joi');
const { findTransactionsByUserId } = require('../models/transactionModel');

const querySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

const getUserTransactions = async (req, res) => {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
        return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const { page, limit } = value;
    const userId = req.session.userId;

    try {
        const { transactions, total } = await findTransactionsByUserId(userId, page, limit);
        res.json({
            success: true,
            transactions: transactions.map(t => ({
                transactionId: t.transaction_id,
                service_type: t.service_type,
                amount: parseFloat(t.amount),
                date: t.created_at,
                card_id: t.card_id,
                status: t.status
            })),
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error('Error fetching transactions:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = { getUserTransactions };