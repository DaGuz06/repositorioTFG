import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import { initDB } from './db';

const app = express();
const PORT = process.env['PORT'] || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
    res.send('ChefPro Backend is running');
});

// Initialize DB tables
initDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
