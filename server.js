const dgram = require('dgram');

const server = dgram.createSocket('udp4');

class Queue {
    constructor() { 
        this.storage = {}; // 값을 저장할 객체
        this.front = 0;    // 첫 원소를 가리킬 포인터
        this.rear = 0;     // 마지막 원소를 가리킬 포인터
    }
    
    size() { 
        return this.rear - this.front;
    }
    
    add(value) {
        this.storage[this.rear] = value;
        this.rear += 1;
    }

    popleft() {
        if (this.size() === 0) {
            return null; // 큐가 비어있을 경우 null 반환
        }
        const temp = this.storage[this.front];
        delete this.storage[this.front];
        this.front += 1;

        // 큐가 비어있으면 포인터 초기화
        if (this.size() === 0) {
            this.front = 0;
            this.rear = 0;
        }
        return temp;
    }
}
// 출처 https://velog.io/@longroadhome/%EC%9E%90%EB%A3%8C%EA%B5%AC%EC%A1%B0-JS%EB%A1%9C-%EA%B5%AC%ED%98%84%ED%95%98%EB%8A%94-.%ED%81%90-Queue

const queue = new Queue();

server.on('message', (msg, rinfo) => {
    const receivedTime = Date.now();
    const messageString = msg.readUint32LE(0);
    queue.add({ message: messageString, rinfo, receivedTime }); // 타임스탬프와 함께 메시지 저장

    console.log(`Message added to queue: ${messageString} from ${rinfo.address}:${rinfo.port}`);
});

setInterval(() => {
    let over50 = 0;
    let under50 = 0;
    let item;

    // while (queue.size() > 0) {
    //     item = queue.popleft();
    //     const parts = item.message.split(' ');
    //     const randNum = parseInt(parts[parts.length - 1], 10); // 메시지의 마지막 숫자 추출 

    //     if (randNum >= 50) {
    //         console.log(`(randNum >= 50): ${item.message} from ${item.rinfo.address}:${item.rinfo.port}`);
    //         over50++;
    //     } else {
    //         console.log(`(randNum < 50): ${item.message} from ${item.rinfo.address}:${item.rinfo.port}`);
    //         under50++;
    //     }
    // }

    while (queue.size() > 0) {
        item = queue.popleft();
        // Dequeued item: {"message":1,"rinfo":{"address":"127.0.0.1","family":"IPv4","port":49159,"size":4},"receivedTime":1720082838052}
        console.log(`Dequeued item: ${JSON.stringify(item)}`);
        if (item.message >= 50) {
            console.log(`(randNum >= 50): ${item.message} from ${item.rinfo.address}:${item.rinfo.port}`);
            over50++;
        } else {
            console.log(`(randNum < 50): ${item.message} from ${item.rinfo.address}:${item.rinfo.port}`);
            under50++;
        }
    }

    if (item) { // 마지막 처리된 아이템이 있을 경우
        const responseMessage = Buffer.alloc(8);
        responseMessage.writeUint32LE(over50, 0);
        responseMessage.writeUInt32LE(under50, 4);

        server.send(responseMessage, item.rinfo.port, item.rinfo.address, (err) => {
            if (err) {
                console.error('Error sending response:', err);
            } else {
                console.log('Response sent to client');
                console.log(`${over50}, ${under50}`);
            }
        });
    }

}, 5000); // 5초마다 큐를 확인하고 처리

server.bind(41234, () => {
    console.log('Server is listening on port 41234');
});