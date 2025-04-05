const pool = require('./db');

async function findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM USER WHERE username = ?', [username]);
    return rows[0];
}

async function createUser(username, email, password, phone_no , nid ) {
    const [result] = await pool.query(
        'INSERT INTO USER (username, email, password, phone_no, nid) VALUES (?, ?, ?, ?, ?)',
        [username, email, password, phone_no, nid]
    );
    return result.insertId;
}

module.exports = { findByUsername, createUser };