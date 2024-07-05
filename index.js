const createServer = require('./server.js');
const createClient = require('./client.js');
const connectDB = require('./db');

createServer();
createClient();

// startClient();
// const connection = connectDB();