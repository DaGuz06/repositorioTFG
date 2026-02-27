import { Request, Response } from 'express';
import { pool } from '../db';
import { Reservation } from '../models/interfaces';

export const createReservation = async (req: Request, res: Response) => {
    try {
        const { name, street, contact_number, chef_id, user_id, date } = req.body;

        if (!name || !street || !contact_number || !date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const { rows } = await pool.query(
            'INSERT INTO reservations (name, street, contact_number, chef_id, user_id, date, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [name, street, contact_number, chef_id || null, user_id || null, new Date(date), 'pending']
        );

        const newReservation: Reservation = {
            id: rows[0].id,
            name,
            street,
            contact_number,
            chef_id,
            user_id,
            status: 'pending',
            date: new Date(date)
        };

        res.status(201).json(newReservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getReservationsByChef = async (req: Request, res: Response) => {
    try {
        const { chefId } = req.params;
        const { rows } = await pool.query(
            'SELECT * FROM reservations WHERE chef_id = $1 ORDER BY date DESC',
            [chefId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateReservationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'accepted', 'declined', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const { rows } = await pool.query(
            'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const checkCanReview = async (req: Request, res: Response) => {
    try {
        const { chefId, userId } = req.params;
        const { rows } = await pool.query(
            "SELECT id FROM reservations WHERE chef_id = $1 AND user_id = $2 AND status = 'completed' LIMIT 1",
            [chefId, userId]
        );

        if (rows.length > 0) {
            res.status(200).json({ canReview: true });
        } else {
            res.status(200).json({ canReview: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
