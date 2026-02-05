import { Request, Response } from 'express';
import { promisePool } from '../db';
import { Reservation } from '../models/interfaces';
import { ResultSetHeader } from 'mysql2';

export const createReservation = async (req: Request, res: Response) => {
    try {
        const { name, street, contact_number, chef_id, date } = req.body;

        if (!name || !street || !contact_number || !date) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [result] = await promisePool.query<ResultSetHeader>(
            'INSERT INTO reservations (name, street, contact_number, chef_id, date) VALUES (?, ?, ?, ?, ?)',
            [name, street, contact_number, chef_id || null, new Date(date)]
        );

        const newReservation: Reservation = {
            id: result.insertId,
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
