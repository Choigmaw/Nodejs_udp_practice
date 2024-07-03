const dgram = require('dgram');

const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    // 템플릿 리터럴을 사용하려면 백틱으로 사용해야함, 작은 따옴표가 아님!
    console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.bind(41234)