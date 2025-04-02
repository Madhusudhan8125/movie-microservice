import express from 'express';
import { config } from './config/index.js';
import { Database } from './lib/database.js';
import { MovieService } from './services/movieService.js';
import { createMovieRoutes } from './routes/movieRoutes.js';

async function startServer() {
    const app = express();
    const movieDb = new Database(config.database.movies);
    const ratingDb = new Database(config.database.ratings);
    const movieService = new MovieService(movieDb, ratingDb);
    app.use(express.json());
    app.use('/api/movies', createMovieRoutes(movieService));
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: err });
    });
    const server = app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    });
    process.on('SIGTERM', async () => {
        await Promise.all([movieDb.close(), ratingDb.close()]);
        server.close(() => process.exit(0));
    });
}

startServer().catch(console.error);