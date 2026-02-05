import { promisePool } from './db';

const run = async () => {
    try {
        const [rows] = await promisePool.query('SHOW TABLES');
        console.log('Tables in database:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Error listing tables:', err);
        process.exit(1);
    }
};

run();
