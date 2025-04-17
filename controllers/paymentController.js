const paymentModel = require('../models/paymentModel');

class PaymentController {
    async processPayment(req, res) {
        const { amount, cardId, service_type } = req.body;
        const userId = req.session.userId; // Assuming userId from auth middleware

        // Validate inputs
        if (  !amount || !cardId ) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (   !userId) {
            return res.status(400).json({ error: 'Missing userId ' });
        }
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        try {
            const result = await paymentModel.processPayment({
                userId,
                amount,
                cardId,
                service_type
            });
            res.json({
                success: true,
                transactionId: result.transactionId,
                message: 'Payment successful'
            });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new PaymentController();