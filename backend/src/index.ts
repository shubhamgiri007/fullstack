import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'idea_board',
  password: process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Initialize database
const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ideas (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        text TEXT NOT NULL CHECK (length(text) <= 280),
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Idea Board API is running' });
});

// Get all ideas
app.get('/api/ideas', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ideas ORDER BY upvotes DESC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Failed to fetch ideas' });
  }
});

// Create a new idea
app.post('/api/ideas', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Idea text is required' });
    }
    
    if (text.length > 280) {
      return res.status(400).json({ error: 'Idea text must be 280 characters or less' });
    }
    
    const result = await pool.query(
      'INSERT INTO ideas (text) VALUES ($1) RETURNING *',
      [text.trim()]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating idea:', error);
    res.status(500).json({ error: 'Failed to create idea' });
  }
});

// Upvote an idea
app.post('/api/ideas/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE ideas SET upvotes = upvotes + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error upvoting idea:', error);
    res.status(500).json({ error: 'Failed to upvote idea' });
  }
});

// Start server
const startServer = async () => {
  await initDatabase();
  
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch(console.error);
