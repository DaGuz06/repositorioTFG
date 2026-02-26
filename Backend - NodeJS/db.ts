import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env['DB_HOST'] || 'localhost',
  port: Number(process.env['DB_PORT']) || 3306,
  user: process.env['DB_USER'] || 'root',
  password: process.env['DB_PASSWORD'] || '',
  database: process.env['DB_NAME'] || 'chef_pro',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const promisePool = pool.promise();

export const initDB = async () => {
  try {
    await promisePool.query('SELECT 1');
    console.log('✅ Database connection successful.');
  } catch (error) {
    console.error('❌ CRITICAL: Could not connect to the database.');
    console.error('   Please ensure MySQL is running on port 3306.');
    console.error('   Details:', (error as any).message);
  }
};
