const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

function connectToDatabase(callback) {
    
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            if (callback) callback(err);
            return 
        }
        console.log('Connected to the database');
        if (callback) callback(null, connection);
    });
}

function insertData(connection, table, data, callback) {
    const placeholders = Object.keys(data).map(() => '?').join(',');
    const columns = Object.keys(data).join(',');
    const values = Object.values(data);

    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            if (callback) callback(err);
            return;
        }
        console.log('Data inserted successfully:', results);
        if (callback) callback(null, results);
    });
}

module.exports = {
    connectToDatabase,
    insertData
};
