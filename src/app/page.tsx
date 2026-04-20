import Link from "next/link";

const features = [
  {
    icon: "🛡️",
    title: "보안",
    subtitle: "Security",
    items: ["침입 감지", "낙상 감지", "이상 행동 탐지"],
    color: "from-indigo-500/20 to-purple-500/20",
    border: "border-indigo-500/20 hover:border-indigo-500/40",
  },
  {
    icon: "💚",
    title: "돌봄",
    subtitle: "Care",
    items: ["생체신호 모니터링", "미이동 감지", "수면 패턴 분석"],
    color: "from-cyan-500/20 to-emerald-500/20",
    border: "border-cyan-500/20 hover:border-cyan-500/40",
  },
  {
    icon: "🔒",
    title: "프라이버시",
    subtitle: "Privacy",
    items: ["카메라 없음", "로컬 데이터 처리", "착용 기기 불필요"],
    color: "from-violet-500/20 to-pink-500/20",
    border: "border-violet-500/20 hover:border-violet-500/40",
  },
];

const techStack = [
  { name: "Next.js", color: "bg-white/10 text-white" },
  { name: "RuView", color: "bg-emerald-500/20 text-emerald-400" },
  { name: "ESP32-S3", color: "bg-orange-500/20 text-orange-400" },
  { name: "TypeScript", color: "bg-blue-500/20 text-blue-400" },
  { name: "Tailwind CSS", color: "bg-cyan-500/20 text-cyan-400" },
];

export default function Home() {
  return (
    <div className="hero-gradient min-h-screen grid-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
              WE
            </div>
            <span className="text-xl font-bold text-white">WifeEye</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              대시보드
            </Link>
            <a
              href="https://github.com/sigco3111/wifeye"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              시작하기
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Open Source Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm text-gray-300">
              오픈소스 · 100% 무료 서비스
            </span>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-8xl font-extrabold mb-6">
            <span className="gradient-text">WifeEye</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
            WiFi가 당신의 눈이 됩니다.
          </p>
          <p className="text-lg text-gray-500 mb-10">
            카메라 없이, 착용 기기 없이.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-semibold text-lg rounded-2xl hover:shadow-lg hover:shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
            >
              시작하기 →
            </Link>
            <a
              href="https://github.com/sigco3111/wifeye"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 border border-white/10 text-gray-300 font-medium text-lg rounded-2xl hover:bg-white/10 transition-all"
            >
              GitHub에서 보기
            </a>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`glass-card p-8 text-left bg-gradient-to-br ${feature.color} ${feature.border}`}
              >
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-bold text-white mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{feature.subtitle}</p>
                <ul className="space-y-2">
                  {feature.items.map((item) => (
                    <li key={item} className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Tech Stack */}
          <div className="mb-20">
            <p className="text-sm text-gray-500 mb-4 uppercase tracking-wider">
              Powered by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech.name}
                  className={`px-4 py-2 rounded-full text-sm font-medium border border-white/5 ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-white mb-10">
              어떻게 작동하나요?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  1
                </div>
                <h4 className="text-white font-semibold mb-2">ESP32-S3 설치</h4>
                <p className="text-sm text-gray-500">
                  RuView 펌웨어를 설치한 ESP32-S3를 각 방에 배치합니다
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                  2
                </div>
                <h4 className="text-white font-semibold mb-2">WiFi 신호 분석</h4>
                <p className="text-sm text-gray-500">
                  CSI(Channel State Information)를 분석하여 움직임과 생체신호를 감지합니다
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                  3
                </div>
                <h4 className="text-white font-semibold mb-2">대시보드 확인</h4>
                <p className="text-sm text-gray-500">
                  WifeEye 대시보드에서 실시간 상태와 알림을 확인합니다
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              WE
            </div>
            <span className="text-sm text-gray-500">
              WifeEye — WiFi 기반 프라이버시 우선 돌봄·보안 플랫폼
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-600">MIT License</span>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-600">Powered by RuView</span>
            <a
              href="https://github.com/sigco3111/wifeye"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
