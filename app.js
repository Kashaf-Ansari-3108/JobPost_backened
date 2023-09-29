const express = require('express');
const userRouter = require('./routes/UserRoutes');
const jobRouter = require('./routes/JobRoutes');
const connectDB = require('./db/db');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Custom CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.get("/sample", (req, res) => {
  res.send("API HIT!!!");
});

// Connect to the database
connectDB();

// Define routes and handle JSON requests
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/job', jobRouter);

// Start the server
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
