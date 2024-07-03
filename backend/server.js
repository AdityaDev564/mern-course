import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger, logEvents } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { corsOptions } from './config/corsOptions.js';
import {connectDB } from './config/dbConn.js'
import mongoose from 'mongoose';

// Import routes
import rootRoutes from './routes/root.js';
import userRouter from './routes/user.route.js';
import noteRouter from './routes/note.route.js'

// Create the `__dirname` equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors(corsOptions));
app.use(logger);
app.use(express.json());
app.use(cookieParser());

console.log(process.env.NODE_ENV);
connectDB();

// Set up static file serving
app.use('/', express.static(path.join(__dirname, 'public')));
// app.use(express.static('public')); // This would also work

// Routes
app.use('/', rootRoutes);
app.use('/users', userRouter);
app.use('/notes', noteRouter);

// Handle all other routes
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

// Start the server
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

mongoose.connection.on('error', err => {
  console.log(err);
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});

