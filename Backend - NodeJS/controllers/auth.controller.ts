import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisePool } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { OAuth2Client } from 'google-auth-library';

const SECRET_KEY = process.env['JWT_SECRET'] || 'super_secret_key';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
    }

    try {
        const [rows] = await promisePool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role_id, name: user.name }, SECRET_KEY, { expiresIn: '24h' });

        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role_id: user.role_id
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password, role_id } = req.body;

    if (!name || !email || !password || !role_id) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
    }

    try {
        // Check if user exists
        const [existingUsers] = await promisePool.query<RowDataPacket[]>('SELECT id FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Default values: active = 1, created_at = NOW() (handled by DB default usually, but let's be safe if schema varies)
        // Adjust query based on if DB has auto defaults. Assuming defaults or we pass them.
        // User schema: id, email, password, name, phone, role_id, active, created_at

        const [result] = await promisePool.query<ResultSetHeader>(
            'INSERT INTO users (name, email, password, role_id, active, created_at) VALUES (?, ?, ?, ?, 1, NOW())',
            [name, email, hashedPassword, role_id]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const client = new OAuth2Client();

export const googleLogin = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        res.status(400).json({ success: false, message: 'Token is required' });
        return;
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            // audience: 'YOUR_CLIENT_ID' // Optional: Specify if you want to verify audience
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(400).json({ success: false, message: 'Invalid token payload' });
            return;
        }

        const email = payload.email;
        // Try to get the best available name from Google payload
        const name = payload.name || payload.given_name || email.split('@')[0];

        // Check if user exists
        const [rows] = await promisePool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [email]);

        let user;

        if (rows.length === 0) {
            // Register new user
            // Generate a random password (user won't use it, but DB might require it)
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            const defaultRoleId = 2; // Assuming 2 is 'client' or standard user

            const [result] = await promisePool.query<ResultSetHeader>(
                'INSERT INTO users (name, email, password, role_id, active, created_at) VALUES (?, ?, ?, ?, 1, NOW())',
                [name, email, hashedPassword, defaultRoleId]
            );

            user = {
                id: result.insertId,
                email: email,
                name: name,
                role_id: defaultRoleId
            };
        } else {
            user = rows[0];
            // Update name if it was previously 'Google User' or empty
            if (!user.name || user.name === 'Google User') {
                await promisePool.query(
                    'UPDATE users SET name = ? WHERE id = ?',
                    [name, user.id]
                );
                user.name = name;
            }
        }

        const jwtToken = jwt.sign({ id: user.id, email: user.email, role: user.role_id, name: user.name }, SECRET_KEY, { expiresIn: '24h' });

        res.json({
            success: true,
            token: jwtToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role_id: user.role_id
            }
        });

    } catch (error) {
        console.error('Google Login error:', error);
        res.status(401).json({ success: false, message: 'Invalid Google Token' });
    }
};
