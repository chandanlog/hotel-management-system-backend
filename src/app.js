import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // For serving images

// Routes
app.use('/api', routes);

// Health Check / Root Route
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Hotel Management System API is running live!',
        timestamp: new Date().toISOString()
    });
});

// 404
// 404
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Handler
app.use(errorHandler);

export default app;
