import { Request, Response } from 'express';
import { promisePool } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

interface MenuItem {
    id: number;
    chef_id: number;
    title: string;
    description: string;
    price: number;
    image_url: string;
}

export const getMenus = async (req: Request, res: Response) => {
    try {
        const chefId = req.query['chef_id'];
        let query = 'SELECT * FROM menus';
        const params: any[] = [];

        if (chefId) {
            query += ' WHERE chef_id = ?';
            params.push(chefId);
        }

        const [rows] = await promisePool.query<RowDataPacket[]>(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching menus:', error);
        res.status(500).json({ message: 'Error fetching menus' });
    }
};

export const getMenuById = async (req: Request, res: Response) => {
    const id = parseInt(req.params['id']);
    try {
        const [rows] = await promisePool.query<RowDataPacket[]>('SELECT * FROM menus WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
        res.status(500).json({ message: 'Error fetching menu' });
    }
};

export const createMenu = async (req: Request, res: Response) => {
    const { chef_id, title, description, price, image_url } = req.body;

    if (!chef_id || !title || !price) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const query = 'INSERT INTO menus (chef_id, title, description, price, image_url) VALUES (?, ?, ?, ?, ?)';
        const [result] = await promisePool.query<ResultSetHeader>(query, [chef_id, title, description, price, image_url]);
        
        res.status(201).json({ 
            message: 'Menu created successfully',
            id: result.insertId
        });
    } catch (error) {
        console.error('Error creating menu:', error);
        res.status(500).json({ message: 'Error creating menu' });
    }
};
