const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const petRoutes = require('./petRoutes');
const userRoutes = require('./userRoutes');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Use routes
app.use('/api', petRoutes);
app.use('/api', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
