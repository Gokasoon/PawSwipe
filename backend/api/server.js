const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'your_username',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'your_database_name',
  password: process.env.DB_PASSWORD || 'your_password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to PostgreSQL.');
  release();
});

const apiRouter = express.Router();

// GET all pets
apiRouter.get('/pets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a random pet
apiRouter.get('/pets/random', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets ORDER BY RANDOM() LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET pet by ID
apiRouter.get('/pets/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM pets WHERE animal_id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Pet not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// POST new pet
apiRouter.post('/pets', async (req, res) => {
  try {
    const { name, breed, species, age, gender, sos, image_url, shelter } = req.body;
    const result = await pool.query(
      'INSERT INTO pets (name, breed, species, age, gender, sos, image_url, shelter) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, breed, species, age, gender, sos, image_url, shelter]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Use the `/api` prefix for all routes
app.use('/api', apiRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});