import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

// Konfigurasi koneksi database
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,      // Ganti dengan username MySQL Anda
    password: process.env.DATABASE_PASSWORD,      // Ganti dengan password MySQL Anda
    database: process.env.DATABASE_NAME // Ganti dengan nama database Anda
});

export default db;
