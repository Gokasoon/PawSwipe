const express = require('express');
const router = express.Router();

require('dotenv').config();

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DOCKER_DATABASE_URL for Docker
});


// GET all pets
router.get('/pets', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a random pet
router.get('/pets/random', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pets ORDER BY RANDOM() LIMIT 1');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET pet by ID
router.get('/pets/:id', async (req, res) => {
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
router.post('/pets', async (req, res) => {
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

module.exports = router;
