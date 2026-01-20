import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env['DB_HOST'] || 'localhost',
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
    console.log('Database connection initialized.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
