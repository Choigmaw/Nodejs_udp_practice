const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const message = Buffer.from('Hello, UDP server');

// setInterval을 사용해서 일정 간격마다 전송
setInterval(() => {
    client.send(message, 41234, 'localhost', (err) => {
        if (err) {
            console.error('Error sending message : ', err);
        } else {
            console.log('Message sent to server');
        }
    });
}, 1000);
