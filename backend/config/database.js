require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

const initializePool = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'acadtrack',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test the connection
    const connection = await pool.getConnection();
    console.log(`✓ MySQL Connected: ${process.env.DB_HOST || 'localhost'}`);
    connection.release();
    
    return pool;
  } catch (error) {
    console.error(`✗ MySQL Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const connectDB = async () => {
  if (!pool) {
    await initializePool();
  }
  return pool;
};

module.exports = connectDB;