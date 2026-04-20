# WifeEye — WiFi 기반 프라이버시 우선 돌봄·보안 플랫폼

<div align="center">

![WifeEye](https://img.shields.io/badge/WifeEye-v0.1.0-indigo?style=for-the-badge)
![Open Source](https://img.shields.io/badge/오픈소스-MIT-green?style=for-the-badge)
![Free](https://img.shields.io/badge/100%25_무료-서비스-cyan?style=for-the-badge)
![Privacy](https://img.shields.io/badge/프라이버시_우선-🛡️-violet?style=for-the-badge)

**WiFi가 당신의 눈이 됩니다. 카메라 없이, 착용 기기 없이.**

[시작하기](#시작하기) · [ESP32 설정 가이드](docs/SETUP.md) · [GitHub](https://github.com/sigco3111/wifeye)

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
│              (Next.js + TypeScript)                    │
│                  http://localhost:3000                  │
└──────────────────────┬───────────────────────────────┘
                       │ MQTT / WebSocket
                       ▼
┌──────────────────────────────────────────────────────┐
│                  RuView 서버                           │
│            (WiFi CSI 데이터 처리 엔진)                  │
└──────────────────────┬───────────────────────────────┘
                       │ WiFi CSI Data
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ ESP32-S3 │ │ ESP32-S3 │ │ ESP32-S3 │
    │  거실    │ │  침실    │ │  주방    │
    └──────────┘ └──────────┘ └──────────┘
```

## 🛠️ 기술 스택

| 구성요소 | 기술 |
|---------|------|
| 프론트엔드 | Next.js 15, React 19, TypeScript |
| 스타일링 | Tailwind CSS 4 |
| WiFi 센싱 | [RuView](https://github.com/ruvnet/RuView) |
| 하드웨어 | ESP32-S3 |
| 통신 | MQTT / WebSocket |
| 라이선스 | MIT (100% 무료) |

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 18.0 이상
- **npm** 또는 **pnpm**
- **ESP32-S3** 보드 (실제 센서 연결 시)
  - ESP32-S3-DevKitC-1 또는 호환 보드

### 1. 저장소 클론

```bash
git clone https://github.com/sigco3111/wifeye.git
cd wifeye
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 대시보드를 확인할 수 있습니다.

### 4. ESP32-S3 설정 (선택사항)

실제 센서를 연결하려면 [ESP32 설정 가이드](docs/SETUP.md)를 참조하세요.

> 💡 센서 없이도 **시뮬레이션 모드**로 모든 기능을 체험할 수 있습니다.

## 📁 프로젝트 구조

```
wifeye/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 랜딩 페이지
│   │   ├── globals.css         # 글로벌 스타일
│   │   └── dashboard/
│   │       ├── layout.tsx      # 대시보드 레이아웃 (사이드바)
│   │       └── page.tsx        # 대시보드 메인 페이지
│   ├── components/
│   │   ├── FloorPlan.tsx       # 인터랙티브 도면
│   │   ├── VitalSigns.tsx      # 생체신호 디스플레이
│   │   ├── ActivityTimeline.tsx # 활동 타임라인
│   │   └── AlertBanner.tsx     # 알림 배너
│   └── lib/
│       └── sensor-simulator.ts # 센서 데이터 시뮬레이터
├── docs/
│   └── SETUP.md                # ESP32 설정 가이드
├── public/
└── README.md
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
