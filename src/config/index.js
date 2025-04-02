import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: process.env.PORT || 3000,
    database: {
        movies: process.env.MOVIES_DB_PATH || './db/movies.db',
        ratings: process.env.RATINGS_DB_PATH || './db/ratings.db'
    },
};