import { promisePool } from './db';

const run = async () => {
    try {
        const [rows] = await promisePool.query(`
            SELECT COLUMN_TYPE, COLLATION_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'users' 
            AND COLUMN_NAME = 'id' 
            AND TABLE_SCHEMA = 'chef_pro'
        `);
        console.log(JSON.stringify(rows));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
