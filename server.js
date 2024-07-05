const dgram = require('dgram');

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

function createServer() {
    const server = dgram.createSocket('udp4');
    const queue = new Queue();

    server.on('message', (msg, rinfo) => {
        const receivedTime = Date.now();
        const messageString = msg.readUint32LE(0);
        queue.add({ message: messageString, rinfo, receivedTime }); // 타임스탬프와 함께 메시지 저장

        console.log(`(서버) Enqueue: ${messageString} from ${rinfo.address}:${rinfo.port}`);
    });

    setInterval(() => {
        let over50 = 0;
        let under50 = 0;
        let item;

        while (queue.size() > 0) {
            item = queue.popleft();
            console.log(`(서버): Dequeue: ${item.message}`);
            if (item.message >= 50) {
                over50++;
                console.log(`50이상 카운트 : ${over50}`);
            } else {
                under50++;
                console.log(`50미만 카운트: ${under50}`);
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
                    console.log(`(서버) 보낸 데이터 : 50이상 ${over50}개, 50미만 ${under50}개`);
                }
            });
        }

    }, 5000); // 5초마다 큐를 확인하고 처리

    server.bind(41234, () => {
        console.log('Server is listening on port 41234');
    });

    return server;
}

module.exports = createServer;
