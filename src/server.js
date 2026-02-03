import 'dotenv/config';
import app from './app.js';
import db from './config/db.js';
import logger from './middleware/logger.js';

const PORT = process.env.PORT || 3000;

// Test DB Connection
db.raw('SELECT 1')
    .then(() => {
        logger.info('Database connected successfully');
        app.listen(PORT, () => {
            logger.info(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        logger.error('Database connection failed');
        logger.error(err);
        process.exit(1);
    });
