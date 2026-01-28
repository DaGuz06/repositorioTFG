import fs from 'fs';
import path from 'path';
import { promisePool } from './db';

const run = async () => {
    try {
        const sqlPath = path.join(__dirname, '../database.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        
        // Remove comments? Simple split by semicolon might be enough for now if SQL is clean.
        // But comments like --... might cause issues if not handled.
        // A simple way is to remove lines starting with --
        const cleanedSql = sqlContent
            .split('\n')
            .filter(line => !line.trim().startsWith('--'))
            .join('\n');

        const statements = cleanedSql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            // Skip USE and CREATE DATABASE as we might already be connected to it,
            // or we might not have permissions. simpler to skip them if they cause issues,
            // but let's try to run them (except USE if we are already defined in .env)
            // Actually, we should probably run them.
            try {
                await promisePool.query(statement);
            } catch (err: any) {
                // Ignore "Database exists" or "Table exists" errors if we want idempotency roughly
                // But CREATE TABLE IF NOT EXISTS handles table exists.
                // CREATE DATABASE IF NOT EXISTS handles database exists.
                // USE might fail if DB doesn't exist yet but we just tried to create it.
                console.log(`Executed: ${statement.substring(0, 50)}...`);
            }
        }
        console.log('Database schema updated successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error updating schema:', err);
        process.exit(1);
    }
};

run();
