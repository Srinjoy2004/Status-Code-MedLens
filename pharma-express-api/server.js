require('dotenv').config();
// const { nanoid } = require('nanoid');
const express = require('express');
const connectDB = require('./config/db'); // Import DB connection
const medicineRoutes = require('./routes/medicineRoutes'); // Import routes

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Use the medicine routes
app.use('/api', medicineRoutes); // Prefix routes with /api

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});