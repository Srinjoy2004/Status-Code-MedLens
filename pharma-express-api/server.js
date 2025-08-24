require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 1. Import the cors package
const connectDB = require('./config/db');
const medicineRoutes = require('./routes/medicineRoutes');

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // 2. Use cors as middleware
app.use(express.json());

// Use the medicine routes
app.use('/api', medicineRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});