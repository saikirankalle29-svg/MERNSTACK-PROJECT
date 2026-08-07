import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './utils/seeder.js';

import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect Database
connectDB().then(() => {
  seedDatabase();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads directory
app.use('/uploads', express.static(uploadsDir));

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'CivicRoute Smart Routing System API',
    groqEnabled: !!process.env.GROQ_API_KEY,
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 CivicRoute Backend Server Running on Port ${PORT}`);
  console.log(`🌐 API Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});
