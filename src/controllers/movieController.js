export class MovieController {
    constructor(movieService) {
        this.movieService = movieService;
    }
    async listAll(req, res) {
        const page = parseInt(req.query.page) || 1;
        const movies = await this.movieService.getAllMovies(page);
        res.json(movies);
    }
    async getDetails(req, res) {
        const { imdbId } = req.params;
        const movie = await this.movieService.getMovieDetails(imdbId);
        res.json(movie);
    }
    async getByYear(req, res) {
        const { year } = req.params;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort === 'desc' ? 'DESC' : 'ASC';
        const movies = await this.movieService.getMoviesByYear(year, page, 50, sort);
        res.json(movies);
    }
    async getByGenre(req, res) {
        const { genre } = req.params;
        const page = parseInt(req.query.page) || 1;
        const movies = await this.movieService.getMoviesByGenre(genre, page);
        res.json(movies);
    }
}