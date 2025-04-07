const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME, // will use e-wallet from .env
})

// (async () => {
//     try{
//         await pool.query('SELECT 1');
//         console.log('Successfully connected to the database.');
//
//     }catch(err){
//         console.error('Database connection error:', err);
//     }
// })();

module.exports = pool;