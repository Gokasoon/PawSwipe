const express = require('express'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

require('dotenv').config();
// console.log('Database URL:', process.env.DATABASE_URL);

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Use DOCKER_DATABASE_URL for Docker
});


// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const user = jwt.verify(token, SECRET_KEY); // Verify the token
    req.user = user; // Attach the user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// User registration
router.post('/users/register', 
    [
      body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
      body('email').isEmail().withMessage('Invalid email address'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ], 
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { username, email, password } = req.body;
  
      try {
        // Check if email already exists
        const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailExists.rows.length > 0) {
          return res.status(400).json({ error: 'Email already exists' });
        }
  
        // Check if username already exists
        const usernameExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (usernameExists.rows.length > 0) {
          return res.status(400).json({ error: 'Username already exists' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
          'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
          [username, email, hashedPassword]
        );
  
        // Generate a JWT token
        const newUser = result.rows[0];
        const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '1h' });
  
        // Respond with the user data and token
        res.status(201).json({ user: newUser, token });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  );
  

// User login
router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Include the role in the JWT payload
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role }); // Return the role in the response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile (authenticated)
router.get('/users/me', authenticateJWT, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 

// Get all users (Admin only) TO SECURE !!!! (example route)
router.get('/users', async (req, res) => {
    try {
      const result = await pool.query('SELECT id, username, email FROM users');
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'No users found' });
      }
  
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Add a like to a pet
router.post('/users/likes', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  const { petId } = req.body;

  try {
    await pool.query(
      'INSERT INTO likes (user_id, pet_id, liked_at) VALUES ($1, $2, NOW())',
      [userId, petId]
    );
    res.status(201).json({ message: 'Pet liked successfully.' });
  } catch (error) {
    console.error('Error saving liked pet:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get liked pets for a user
router.get('/users/likes', authenticateJWT, async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT pets.* FROM likes JOIN pets ON likes.pet_id = pets.animal_id WHERE likes.user_id = $1',
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
