# Client

- 1초마다 타임스템프와 0~99의 랜덤 정수를 문자열로 UDP 서버에 전송한다.
- 전송하는 데이터는 UTF-8로 인코딩해서 보낸다.

---

# Server

- Client로부터 수신한 데이터를 디코딩 하여 Queue에 저장한다.
- 5초에 한번씩 Queue에 있는 문자열 파싱하여 값에 따라 작업한다.


