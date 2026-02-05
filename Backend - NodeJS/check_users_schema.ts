import { promisePool } from './db';

const run = async () => {
    try {
        const [rows] = await promisePool.query('DESCRIBE users');
        console.log('Users Table Structure:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Error describing table:', err);
        process.exit(1);
    }
};

run();
