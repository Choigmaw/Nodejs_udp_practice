const createServer = require('./server.js');
const createClient = require('./client.js');
const db = require('./db.js');

createServer();
createClient();
db.connectToDatabase();
// startClient();
// const connection = connectDB();