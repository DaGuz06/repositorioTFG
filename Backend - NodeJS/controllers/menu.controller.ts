import { Request, Response } from 'express';
import { pool } from '../db';

export const getMenus = async (req: Request, res: Response) => {
    const chefId = req.query['chefId'];

    try {
        let query = 'SELECT * FROM menus';
        const params: any[] = [];

        if (chefId) {
            query += ' WHERE chef_id = $1';
            params.push(parseInt(chefId as string));
        }

        query += ' ORDER BY created_at DESC';

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ message: 'Error fetching menus' });
    }
};

export const createMenu = async (req: Request, res: Response) => {
    const { chef_id, title, description, price, image_url } = req.body;

    if (!chef_id || !title || !price) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        const { rows } = await pool.query(
            'INSERT INTO menus (chef_id, title, description, price, image_url, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id',
            [chef_id, title, description || '', price, image_url || '']
        );

        res.status(201).json({
            id: rows[0].id,
            chef_id,
            title,
            description,
            price,
            image_url,
            success: true
        });
    } catch (error) {
        console.error('Error creating menu:', error);
        res.status(500).json({ message: 'Error creating menu' });
    }
};

export const deleteMenu = async (req: Request, res: Response) => {
    const id = req.params['id'];

    try {
        await pool.query('DELETE FROM menus WHERE id = $1', [id]);
        res.json({ message: 'Menu deleted successfully', success: true });
    } catch (error) {
        console.error('Error deleting menu:', error);
        res.status(500).json({ message: 'Error deleting menu' });
    }
};
