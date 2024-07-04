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
    queue.add(msg);
    if (queue.size() === 2) {
        console.log('큐에 2개 쌓임');
        queue.popleft();
        // 템플릿 리터럴을 사용하려면 백틱으로 사용해야함, 작은 따옴표가 아님!
        console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);
    }
});

server.bind(41234)