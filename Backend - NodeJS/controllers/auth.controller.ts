import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { OAuth2Client } from 'google-auth-library';

const SECRET_KEY = process.env['JWT_SECRET'] || 'super_secret_key';

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
    }

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

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
                role_id: user.role_id,
                profile_picture: user.profile_picture || null
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
        const { rows: existingUsers } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

        if (existingUsers.length > 0) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(
            'INSERT INTO users (name, email, password, role_id, active, created_at) VALUES ($1, $2, $3, $4, 1, NOW()) RETURNING id',
            [name, email, hashedPassword, role_id]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: rows[0].id
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
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(400).json({ success: false, message: 'Invalid token payload' });
            return;
        }

        const email = payload.email;
        const name = payload.name || payload.given_name || email.split('@')[0];

        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        let user;

        if (rows.length === 0) {
            const randomPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            const defaultRoleId = 2;

            const { rows: newRows } = await pool.query(
                'INSERT INTO users (name, email, password, role_id, active, created_at) VALUES ($1, $2, $3, $4, 1, NOW()) RETURNING id',
                [name, email, hashedPassword, defaultRoleId]
            );

            user = {
                id: newRows[0].id,
                email: email,
                name: name,
                role_id: defaultRoleId,
                profile_picture: null
            };
        } else {
            user = rows[0];
            if (!user.name || user.name === 'Google User') {
                await pool.query('UPDATE users SET name = $1 WHERE id = $2', [name, user.id]);
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
                role_id: user.role_id,
                profile_picture: user.profile_picture || null
            }
        });

    } catch (error) {
        console.error('Google Login error:', error);
        res.status(401).json({ success: false, message: 'Invalid Google Token' });
    }
};
