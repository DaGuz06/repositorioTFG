import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

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

        let isProfileCompleted = false;

        // If the user is a Chef, check if they have a completed profile
        if (user.role_id === 1) {
            const profileVerification = await pool.query('SELECT 1 FROM chef_profiles WHERE user_id = $1 LIMIT 1', [user.id]);
            if (profileVerification.rows.length > 0) {
                isProfileCompleted = true;
            }
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
                profile_picture: user.profile_picture || null,
                is_profile_completed: isProfileCompleted
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
