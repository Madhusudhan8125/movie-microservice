import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class Database {
    constructor(dbPath) {
        this.db = new sqlite3.Database(dbPath);
        this.db.getAsync = promisify(this.db.get.bind(this.db));
        this.db.allAsync = promisify(this.db.all.bind(this.db));
    }
    get = async (query, params = []) => this.db.getAsync(query, params);
    all = (query, params = []) => this.db.allAsync(query, params);
    close = async () => new Promise((resolve, reject) => this.db.close((err) => err ? reject(err) : resolve()));
}