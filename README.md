# WifeEye — WiFi 기반 프라이버시 우선 돌봄·보안 플랫폼

<div align="center">

![WifeEye](https://img.shields.io/badge/WifeEye-v0.2.0-indigo?style=for-the-badge)
![Open Source](https://img.shields.io/badge/오픈소스-MIT-green?style=for-the-badge)
![Free](https://img.shields.io/badge/100%25_무료-서비스-cyan?style=for-the-badge)
![Privacy](https://img.shields.io/badge/프라이버시_우선-🛡️-violet?style=for-the-badge)

**WiFi가 당신의 눈이 됩니다. 카메라 없이, 착용 기기 없이.**

[시작하기](#시작하기) · [Docker 배포](#docker-배포) · [GitHub](https://github.com/sigco3111/wifeye)

</div>

---

## 📋 프로젝트 소개

WifeEye는 WiFi 신호 분석(CSI - Channel State Information)을 활용하여 **카메라 없이** 실내의 보안과 돌봄을 실현하는 오픈소스 플랫폼입니다.

[**RuView**](https://github.com/ruvnet/RuView) 오픈소스 WiFi 센싱 플랫폼과 **ESP32-S3** 하드웨어를 기반으로 구동되며, 모든 데이터는 로컬에서 처리되어 프라이버시가 완벽하게 보호됩니다.

> 💡 **WifeEye** = **Wi**Fi + **Eye** — WiFi로 세상을 봅니다

## ✨ 주요 기능

### 🛡️ 보안 (Security)
- **침입 감지** — 등록되지 않은 사람의 접근을 실시간으로 감지
- **낙상 감지** — WiFi 신호 변화로 낙상 사고를 즉시 감지
- **이상 행동 탐지** — 평소와 다른 움직임 패턴 감지

### 💚 돌봄 (Care)
- **생체신호 모니터링** — 호흡수, 심박수를 비접촉으로 측정
- **미이동 감지** — 장시간 미이동 시 알림 발송
- **수면 패턴 분석** — 수면 상태와 질을 추적

### 🔒 프라이버시 (Privacy)
- **카메라 없음** — 영상 데이터를 전혀 수집하지 않음
- **로컬 데이터 처리** — 모든 데이터는 기기 내에서 처리
- **착용 기기 불필요** — 스마트워치 등의 추가 기기 없이 작동

## 🏗️ 아키텍처

```
┌──────────────────────────────────────────────────────┐
│                    WifeEye 대시보드                     │
│            (Next.js 16 + TypeScript + Zustand)         │
│                  http://localhost:3000                  │
└──────────────────────┬───────────────────────────────┘
                       │ MQTT over WebSocket
                       ▼
┌──────────────────────────────────────────────────────┐
│              Mosquitto MQTT Broker                     │
│           (TCP 1883 / WebSocket 9001)                  │
└──────────────────────┬───────────────────────────────┘
                       │ WiFi CSI Data
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ ESP32-S3 │ │ ESP32-S3 │ │ ESP32-S3 │
    │  거실    │ │  침실    │ │  주방    │
    └──────────┘ └──────────┘ └──────────┘
```

> 💡 센서 없이도 **시뮬레이션 모드**로 모든 기능을 체험할 수 있습니다.

## 🛠️ 기술 스택

| 구성요소 | 기술 |
|---------|------|
| 프론트엔드 | Next.js 16, React 19, TypeScript |
| 상태 관리 | Zustand |
| 스타일링 | Tailwind CSS 4, shadcn/ui |
| 차트 | Recharts |
| 통신 | MQTT over WebSocket |
| 테스트 | Vitest, @testing-library/react |
| 컨테이너 | Docker, Docker Compose |
| WiFi 센싱 | [RuView](https://github.com/ruvnet/RuView) |
| 하드웨어 | ESP32-S3 |
| 라이선스 | MIT (100% 무료) |

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 20.0 이상
- **npm**

### 1. 저장소 클론

```bash
git clone https://github.com/sigco3111/wifeye.git
cd wifeye
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 설정

```bash
cp .env.example .env.local
```

| 환경변수 | 설명 | 기본값 |
|---------|------|--------|
| `NEXT_PUBLIC_MQTT_URL` | MQTT 브로커 WebSocket URL | `ws://localhost:9001` |
| `NEXT_PUBLIC_SIMULATION_MODE` | 시뮬레이션 모드 (센서 없이 구동) | `true` |
| `PORT` | 대시보드 포트 | `3000` |

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 대시보드를 확인할 수 있습니다.

### 5. 테스트 실행

```bash
npm run test
```

## 🐳 Docker 배포

### 전체 스택 실행 (앱 + MQTT 브로커)

```bash
npm run docker:up
```

Mosquitto MQTT 브로커가 함께 실행되며, 앱은 자동으로 브로커에 연결합니다.

### 개별 명령어

```bash
npm run docker:build    # Docker 이미지 빌드
npm run docker:run      # 컨테이너 실행 (단독)
npm run docker:up       # docker compose로 전체 스택 시작
npm run docker:down     # 전체 스택 중지
npm run docker:logs     # 실시간 로그 확인
```

### 포트 구성

| 포트 | 서비스 | 설명 |
|------|--------|------|
| 3000 | WifeEye 대시보드 | Next.js standalone 서버 |
| 1883 | Mosquitto | MQTT TCP (센서 통신) |
| 9001 | Mosquitto | MQTT WebSocket (대시보드 통신) |

## 📁 프로젝트 구조

```
wifeye/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # 루트 레이아웃
│   │   ├── page.tsx                    # 랜딩 페이지
│   │   ├── globals.css                 # 글로벌 스타일 (다크 테마)
│   │   └── dashboard/
│   │       ├── layout.tsx              # 대시보드 레이아웃 (사이드바)
│   │       ├── page.tsx                # 대시보드 개요
│   │       ├── alerts/page.tsx         # 알림 목록
│   │       ├── reports/page.tsx        # 통계 리포트
│   │       ├── rooms/page.tsx          # 방 관리
│   │       └── settings/page.tsx       # 설정
│   ├── components/
│   │   ├── ui/                         # shadcn/ui 컴포넌트
│   │   ├── shared/                     # 공유 레이아웃 컴포넌트
│   │   └── dashboard/                  # 대시보드 기능 컴포넌트
│   ├── hooks/                          # 커스텀 React 훅
│   ├── stores/                         # Zustand 상태 스토어
│   ├── lib/
│   │   ├── mqtt/                       # MQTT 통신 레이어
│   │   ├── simulation/                 # 센서 데이터 시뮬레이터
│   │   ├── detection/                  # 감지 알고리즘
│   │   └── utils.ts                    # 유틸리티
│   └── types/                          # TypeScript 타입 정의
├── src/__tests__/                      # 테스트 스위트 (146개 테스트)
├── Dockerfile                          # 멀티스테이지 프로덕션 빌드
├── docker-compose.yml                  # 앱 + Mosquitto 구성
├── mosquitto.conf                      # MQTT 브로커 설정
└── .env.example                        # 환경변수 템플릿
```

## 🔐 프라이버시 보장

WifeEye는 프라이버시를 최우선으로 설계되었습니다:

1. **영상 데이터 없음** — 카메라를 사용하지 않습니다
2. **로컬 처리** — 모든 CSI 데이터는 로컬에서 처리됩니다
3. **클라우드 의존 없음** — 외부 서버에 개인 데이터를 전송하지 않습니다
4. **오픈소스** — 코드가 공개되어 있어 검증 가능합니다

## 📄 라이선스

[MIT License](LICENSE) — 100% 무료, 오픈소스

---

<div align="center">

**WifeEye** — WiFi 기반 프라이버시 우선 돌봄·보안 플랫폼

Powered by [RuView](https://github.com/ruvnet/RuView) · Built with ❤️

</div>
