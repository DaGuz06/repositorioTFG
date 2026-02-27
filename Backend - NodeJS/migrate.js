const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env['DB_HOST'] || 'localhost',
    port: Number(process.env['DB_PORT']) || 5432,
    user: process.env['DB_USER'] || 'postgres',
    password: process.env['DB_PASSWORD'] || '',
    database: process.env['DB_NAME'] || 'chef_pro',
});

async function migrate() {
    try {
        await pool.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS user_id BIGINT DEFAULT NULL REFERENCES users(id);`);
        await pool.query(`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';`);
        console.log('Migration successful.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        pool.end();
    }
}
migrate();
