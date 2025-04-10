
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRoutes } from './routes/userRoutes';
import { treeRoutes } from './routes/treeRoutes';
import { memberRoutes } from './routes/memberRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/members', memberRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Family Tree API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
