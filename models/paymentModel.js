const pool = require('./db');
class PaymentModel {
    async processPayment({ userId,  amount, cardId, service_type }) {
        const connection = await pool.getConnection();
        try {
            // Start transaction
            await connection.beginTransaction();

            // Validate card
            const [cardRows] = await connection.query(
                'SELECT balance FROM bank_cards WHERE card_id = ? AND user_id = ?',
                [cardId, userId]
            );
            if (cardRows.length === 0) {
                throw new Error('Invalid card or unauthorized access');
            }
            const card = cardRows[0];
            if (card.balance < amount) {
                throw new Error('Insufficient card balance');
            }

            // Get or create service ID for electricity
            let [serviceRows] = await connection.query(
                'SELECT service_id FROM service WHERE service_type = ?',
                [service_type]
            );
            if (serviceRows.length === 0) {
                [serviceRows] = await connection.query(
                    'INSERT INTO service (service_type) VALUES (?)',
                    [service_type]
                );
                serviceRows = [{ service_id: serviceRows.insertId }];
            }
            const serviceId = serviceRows[0].service_id;

            // Update card balance and expense
            await connection.query(
                'UPDATE bank_cards SET balance = balance - ?, expense = expense + ? WHERE card_id = ?',
                [amount, amount, cardId]
            );

            // Insert transaction
            const [transactionResult] = await connection.query(
                'INSERT INTO transaction (user_id, amount, transaction_type, card_id, status, service_id) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, amount, 'payment', cardId, 'completed', serviceId]
            );

            // Commit transaction
            await connection.commit();

            return {
                transactionId: `TXN${transactionResult.insertId.toString().padStart(9, '0')}`
            };
        } catch (error) {
            // Rollback transaction on error
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = new PaymentModel();
