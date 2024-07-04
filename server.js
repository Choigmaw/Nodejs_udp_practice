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
    const messageString = msg.toString('utf-8');
    queue.add({ message: messageString, rinfo, receivedTime }); // 타임스탬프와 함께 메시지 저장

    console.log(`Message added to queue: ${messageString} from ${rinfo.address}:${rinfo.port}`);
});

setInterval(() => {
    while (queue.size() > 0) {
        const item = queue.popleft();
        const currentTime = Date.now();
        // const elapsedTime = (currentTime - item.receivedTime) / 1000; // 경과 시간 (초 단위)
        const parts = item.message.split(' ');
        const randNum = parseInt(parts[parts.length - 1], 10); // 메시지의 마지막 숫자 추출
        
        // 랜덤 값에 따라 다른 행동 수행
        if (randNum >= 50) {
            console.log(`Processing message (randNum >= 50): ${item.message} from ${item.rinfo.address}:${item.rinfo.port}`);
            // 필요한 작업 수행
        } else {
            console.log(`Skipping message (randNum < 50): ${item.message} from ${item.rinfo.address}:${item.rinfo.port}`);
            // 다른 작업 수행 또는 메시지 무시
        }
    }
}, 5000); // 5초마다 큐를 확인하고 처리

server.bind(41234, () => {
    console.log('Server is listening on port 41234');
});