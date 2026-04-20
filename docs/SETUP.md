# ESP32-S3 설정 가이드

WifeEye와 RuView를 사용하여 WiFi 센싱 환경을 구축하는 방법을 안내합니다.

## 📦 필요한 하드웨어

| 항목 | 사양 | 추천 제품 |
|------|------|----------|
| **메인 보드** | ESP32-S3 (WiFi + BLE) | Espressif ESP32-S3-DevKitC-1 |
| **USB 케이블** | USB-C (데이터 전송 가능) | — |
| **전원 공급** | 5V Micro USB 또는 USB-C | 스마트폰 충전기 가능 |
| **선택: 케이스** | 3D 프린팅 또는 일반 케이스 | — |

### ESP32-S3 보드 사양 요구사항

- WiFi 802.11 b/g/n 지원
- 최소 4MB Flash 메모리
- 최소 2MB PSRAM (권장 8MB)
- UART 직렬 인터페이스

## 🔧 펌웨어 플래싱

### 1. 개발 환경 설정

```bash
# ESP-IDF 설치 (macOS)
git clone --recursive https://github.com/espressif/esp-idf.git
cd esp-idf
./install.sh esp32s3
source export.sh

# 또는 PlatformIO 사용 (VS Code 확장 프로그램)
# VS Code에서 PlatformIO 확장 프로그램 설치 후 프로젝트 임포트
```

### 2. RuView 펌웨어 다운로드

```bash
git clone https://github.com/ruvnet/RuView.git
cd RuView
```

### 3. 펌웨어 빌드 및 플래싱

```bash
# ESP-IDF 사용 시
idf.py set-target esp32s3
idf.py build
idf.py -p /dev/ttyUSB0 flash

# PlatformIO 사용 시
pio run -t upload
```

### 4. 시리얼 모니터로 확인

```bash
idf.py -p /dev/ttyUSB0 monitor
# 또는
pio device monitor
```

정상적으로 부팅되면 다음과 같은 로그가 표시됩니다:

```
I (3250) wifi: connected to AP
I (3251) wifi: AP's bssid: xx:xx:xx:xx:xx:xx
I (3260) wifi: AP's channel: 6
I (3300) wifi: got ip:192.168.1.xxx
I (3300) ruview: CSI data collection started
```

## 📶 WiFi 프로비저닝

### 자동 프로비저닝 (권장)

RuView는 BLE를 통한 WiFi 프로비저닝을 지원합니다:

1. ESP32-S3 보드에 전원 연결
2. 스마트폰에서 RuView 프로비저닝 앱 실행
3. BLE로 ESP32-S3와 페어링
4. WiFi 네트워크 이름(SSID)과 비밀번호 입력
5. 연결 완료 — 보드가 자동으로 WiFi에 연결됩니다

### 수동 설정 (Advanced)

`ruview_config.h` 파일에서 WiFi 자격 증명을 직접 설정:

```c
#define WIFI_SSID "your_wifi_ssid"
#define WIFI_PASSWORD "your_wifi_password"
```

## 🔗 WifeEye 대시보드 연결

### 1. RuView 서버 설정

```bash
# RuView 서버 실행
cd RuView
python3 server.py --port 1883
```

### 2. WifeEye 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
# RuView 서버 주소
NEXT_PUBLIC_RUVIEW_SERVER_URL=http://localhost:1883

# MQTT 설정 (선택)
NEXT_PUBLIC_MQTT_BROKER=mqtt://localhost:1883
NEXT_PUBLIC_MQTT_USERNAME=wifeye
NEXT_PUBLIC_MQTT_PASSWORD=your_password
```

### 3. 센서 등록

대시보드에서 **설정 → 방 관리**로 이동하여 센서를 추가합니다:

1. **방 이름** 입력 (예: 거실, 침실, 주방)
2. **센서 ID** 입력 (ESP32-S3의 MAC 주소)
3. **위치** 설정
4. 저장

### 4. 연결 확인

대시보드 헤더에서 시뮬레이션 모드 → 실시간 모드로 전환하여 센서 데이터를 확인합니다.

## 🏠 센서 배치 가이드

### 권장 배치 위치

| 방 | 높이 | 위치 | 주의사항 |
|----|------|------|----------|
| 거실 | 1.5~2m | 벽면 중앙 | TV, 전자레인지에서 멀리 배치 |
| 침실 | 1.5~2m | 침대 맞은편 벽 | 선풍기, 공기청정기 주의 |
| 주방 | 1.5~2m | 출입구 근처 | 전자레인지 간섭 주의 |
| 화장실 | 1.5~2m | 문 위쪽 | 습기에 주의 |

### 배치 팁

- **전원 공급**이 안정적인 위치에 배치하세요
- **다른 전자기기**와 최소 1m 이상 거리 유지
- **WiFi 라우터**와 같은 방에 있을 필요는 없지만, 신호가 도달해야 합니다
- 감지 범위는 보통 **반경 3~5m** 입니다

## 🐛 문제 해결

### 펌웨어 플래싱 실패

```
문제: "Failed to connect to ESP32"
해결:
1. USB 케이블이 데이터 전송 가능한지 확인
2. 보드의 BOOT 버튼을 누른 상태에서 EN(RST) 버튼 누르기
3. CP210x 또는 CH340 드라이버 설치
```

### WiFi 연결 실패

```
문제: 보드가 WiFi에 연결되지 않음
해결:
1. 2.4GHz WiFi 네트워크인지 확인 (5GHz 미지원)
2. WiFi 비밀번호가 올바른지 확인
3. 라우터에서 MAC 주소 필터링 확인
4. WiFi 신호 강도 확인 (-70dBm 이상 권장)
```

### CSI 데이터 수집 안 됨

```
문제: "No CSI data received"
해결:
1. ESP32-S3 보드가 WiFi에 연결되어 있는지 확인
2. RuView 서버가 실행 중인지 확인
3. MQTT 브로커 연결 상태 확인
4. 보드 재부팅 시도
```

### 대시보드에 데이터가 표시되지 않음

```
문제: 대시보드가 빈 상태로 표시됨
해결:
1. .env.local 설정이 올바른지 확인
2. RuView 서버가 실행 중인지 확인
3. 브라우저 콘솔에서 에러 확인
4. 시뮬레이션 모드로 전환하여 대시보드 정상 동작 확인
```

### 낮은 감지 정확도

```
문제: 움직임이나 낙상을 감지하지 못함
해결:
1. 센서 배치 위치 조정 (높이 1.5~2m 권장)
2. 다른 전자기기 간섭 최소화
3. 감지 범위 내에 대상이 있는지 확인
4. WiFi 신호 품질 확인
```

## 📞 추가 지원

- **GitHub Issues**: [https://github.com/sigco3111/wifeye/issues](https://github.com/sigco3111/wifeye/issues)
- **RuView 문서**: [https://github.com/ruvnet/RuView](https://github.com/ruvnet/RuView)
- **ESP32-S3 문서**: [https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/](https://docs.espressif.com/projects/esp-idf/en/latest/esp32s3/)
