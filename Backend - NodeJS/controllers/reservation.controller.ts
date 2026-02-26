import { Request, Response } from 'express';
import { pool } from '../db';
import { Reservation } from '../models/interfaces';

export const createReservation = async (req: Request, res: Response) => {
    try {
        const { name, street, contact_number, chef_id, date } = req.body;

        if (!name || !street || !contact_number || !date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const { rows } = await pool.query(
            'INSERT INTO reservations (name, street, contact_number, chef_id, date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, street, contact_number, chef_id || null, new Date(date)]
        );

        const newReservation: Reservation = {
            id: rows[0].id,
            name,
            street,
            contact_number,
            chef_id,
            date: new Date(date)
        };

        res.status(201).json(newReservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
