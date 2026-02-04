
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    // 1. Create Database if not exists
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || ''
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'chef_pro'}\``);
    console.log(`Database ${process.env.DB_NAME || 'chef_pro'} created or already exists.`);
    await connection.end();

    // 2. Import SQL
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'chef_pro',
        multipleStatements: true
    });

    const sqlPath = path.resolve(__dirname, '../chef_pro_version2.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    try {
        await pool.query(sql);
        console.log('SQL imported successfully.');
    } catch (err) {
        console.error('Error importing SQL:', err);
    } finally {
        await pool.end();
    }
};

run();
