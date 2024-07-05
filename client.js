const dgram = require('dgram');

const client = dgram.createSocket('udp4');


function createClient() {
    setInterval(() => {
        const randNum = Math.floor(Math.random() * 100); 
        const messageBuffer = Buffer.alloc(4);
        messageBuffer.writeUInt32LE(randNum, 0); // 리틀 엔디안으로 숫자 저장
    
        client.send(messageBuffer, 41234, 'localhost', (err) => {
            if (err) {
                console.error('Error sending message : ', err);
            } else {
                console.log(`(클라이언트) 보낸 데이터 : ${randNum}`);
            }
        });
    }, 1000);
    
    client.on('message', (msg, rinfo) => {
        const over50 = msg.readUInt32LE(0);
        const under50 = msg.readUInt32LE(4);
    
        console.log(`(클라이언트) 받은 데이터: 50보다 큰 값 ${over50}개, 50보다 작은 값 ${under50}개 from ${rinfo.address}:${rinfo.port}`);
    });
}

module.exports = createClient;
