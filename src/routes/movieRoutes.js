import express from 'express';
import { MovieController } from '../controllers/movieController.js';

export const createMovieRoutes = (movieService) => {
    const router = express.Router();
    const controller = new MovieController(movieService);

    router.get('/', controller.listAll.bind(controller));
    router.get('/:imdbId', controller.getDetails.bind(controller));
    router.get('/year/:year', controller.getByYear.bind(controller));
    router.get('/genre/:genre', controller.getByGenre.bind(controller));

    return router;
};