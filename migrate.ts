import { pool } from './Backend - NodeJS/db';

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
