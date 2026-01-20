"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const SECRET_KEY = process.env['JWT_SECRET'] || 'super_secret_key';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
    }
    try {
        const [rows] = yield db_1.promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const user = rows[0];
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role_id, name: user.name }, SECRET_KEY, { expiresIn: '24h' });
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
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role_id } = req.body;
    if (!name || !email || !password || !role_id) {
        res.status(400).json({ success: false, message: 'All fields are required' });
        return;
    }
    try {
        // Check if user exists
        const [existingUsers] = yield db_1.promisePool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            res.status(400).json({ success: false, message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Default values: active = 1, created_at = NOW() (handled by DB default usually, but let's be safe if schema varies)
        // Adjust query based on if DB has auto defaults. Assuming defaults or we pass them.
        // User schema: id, email, password, name, phone, role_id, active, created_at
        const [result] = yield db_1.promisePool.query('INSERT INTO users (name, email, password, role_id, active, created_at) VALUES (?, ?, ?, ?, 1, NOW())', [name, email, hashedPassword, role_id]);
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            userId: result.insertId
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
exports.register = register;
