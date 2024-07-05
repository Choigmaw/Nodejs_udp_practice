const mysql = require('mysql2');
const dotenv = require('dotenv');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'choigmaw0320',
    database: 'test'
});

function connectToDatabase(callback) {
    
    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            if (callback) callback(err);
            return;
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
