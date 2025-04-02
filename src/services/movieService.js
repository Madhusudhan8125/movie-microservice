export class MovieService {
    constructor(movieDb, ratingDb) {
        this.movieDb = movieDb;
        this.ratingDb = ratingDb;
    }
    async getAllMovies(page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        const query = `
      SELECT imdbId, title, genres, releaseDate, budget 
      FROM movies 
      LIMIT ? OFFSET ?
    `;
        const movies = await this.movieDb.all(query, [limit, offset]);
        return this.formatMovies(movies);
    }
    async getMovieDetails(imdbId) {
        const movieQuery = `
        SELECT imdbId, title, overview as description, releaseDate, 
               budget, runtime, language as originalLanguage, productionCompanies
        FROM movies 
        WHERE imdbId = ?
    `;
        const movie = await this.movieDb.get(movieQuery, [imdbId]);
        if (!movie) {
            throw new Error(`there is no movie with this imdbId : ${imdbId}`);
        }
        const movieIdQuery = `SELECT movieId FROM movies WHERE imdbId = ?`;
        const movieIdResult = await this.movieDb.get(movieIdQuery, [imdbId]);

        // if (!movieIdResult) {
        //     return {
        //         ...this.formatMovie(movie),
        //         averageRating: null,
        //     };
        // }

        const ratingQuery = `
        SELECT AVG(rating) as averageRating 
        FROM ratings 
        WHERE movieId = ?
    `;

        const rating = await this.ratingDb.get(ratingQuery, [movieIdResult.movieId]);

        return {
            ...this.formatMovie(movie),
            averageRating: rating?.averageRating || null
        };
    }
    async getMoviesByYear(year, page = 1, limit = 50, sort = 'ASC') {

        const offset = (page - 1) * limit;
        const query = `
      SELECT imdbId, title, genres, releaseDate, budget 
      FROM movies 
      WHERE strftime('%Y', releaseDate) = ?
      ORDER BY releaseDate ${sort}
      LIMIT ? OFFSET ?
    `;

        const movies = await this.movieDb.all(query, [year, limit, offset]);
        return this.formatMovies(movies);
    }

    async getMoviesByGenre(genre, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
        const query = `
      SELECT imdbId, title, genres, releaseDate, budget 
      FROM movies 
      WHERE genres LIKE ?
      LIMIT ? OFFSET ?
    `;
        const movies = await this.movieDb.all(query, [`%${genre}%`, limit, offset]);
        return this.formatMovies(movies);
    }

    formatMovies =(movies) => movies.map(this.formatMovie);

    formatMovie(movie) {
        return {
            ...movie,
            budget: `$${movie.budget.toLocaleString()}`,
            genres: movie.genres ? JSON.parse(movie.genres).map(genre => genre.name) : []
        };
    }
}