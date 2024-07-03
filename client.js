const dgram = require('dgram');

const client = dgram.createSocket('udp4');

const message = Buffer.from('Hello, UDP server');
client.send(message, 41234, 'localhost', (err) => {
    client.close();
});
