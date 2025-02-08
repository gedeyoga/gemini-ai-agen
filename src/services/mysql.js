import mysql from 'mysql2/promise';

// Konfigurasi koneksi database
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Ganti dengan username MySQL Anda
    password: '',      // Ganti dengan password MySQL Anda
    database: 'openacc_prod' // Ganti dengan nama database Anda
});

export default db;
