# Client

- 1초마다 0~99의 랜덤 정수를 UDP 서버에 전송한다.
- 전송하는 데이터는 UInt32LE 인코딩해서 보낸다.

---

# Server

- Client로부터 수신한 데이터를 디코딩 하여 Queue에 저장한다.
- queue.add({ message: messageString, rinfo, receivedTime }); // 타임스탬프와 함께 메시지 저장
- 5초에 한번씩 Queue에 있는 message 값을 50 이상과 50 미만으로 카운트 한다
- 카운트 한 값을 UInt32LE 인코딩해서 클라이언트로 수신한다.


