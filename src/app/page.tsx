"use client";

import Link from "next/link";
import { Shield, Heart, Lock, Wifi, Eye, ArrowRight, Activity, Moon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)] backdrop-blur-lg border-b border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WE</span>
              </div>
              <span className="text-xl font-bold text-[var(--foreground)]">WifeEye</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/dashboard" className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors">
                대시보드
              </Link>
              <Link 
                href="https://github.com/sigco3111/wifeye" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
              >
                GitHub
              </Link>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <Button>
                <Link href="/dashboard" className="text-inherit">시작하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 hero-gradient grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <Badge className="bg-green-500/10 text-green-400">
                오픈소스 · 100% 무료 서비스
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-7xl font-bold mb-6">
              <span className="gradient-text">WifeEye</span>
            </h1>

            {/* Subtitle */}
            <p className="text-2xl text-[var(--foreground)] mb-4">
              WiFi가 당신의 눈이 됩니다.
            </p>

            {/* Sub-subtitle */}
            <p className="text-lg text-[var(--muted)] mb-8">
              카메라 없이, 착용 기기 없이.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button className="bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-lg hover:shadow-xl transition-shadow px-6 py-3">
                <Link href="/dashboard" className="text-inherit">시작하기 <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button className="text-[var(--foreground)] hover:text-[var(--primary)] px-6 py-3 border border-[var(--glass-border)] hover:bg-[var(--glass-bg)]">
                <a href="https://github.com/sigco3111/wifeye" target="_blank" rel="noopener noreferrer" className="text-inherit">GitHub에서 보기 <ChevronRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Security */}
            <Card className="glass-card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Shield className="h-10 w-10 text-indigo-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">보안</h3>
                    <p className="text-sm text-[var(--muted)]">Security</p>
                  </div>
                </div>
                <ul className="space-y-2 text-[var(--foreground)]">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>침입 감지</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>낙상 감지</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>이상 행동 탐지</span>
                  </li>
                </ul>
              </Card>

            {/* Card 2 - Care */}
            <Card className="glass-card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Heart className="h-10 w-10 text-pink-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">돌봄</h3>
                    <p className="text-sm text-[var(--muted)]">Care</p>
                  </div>
                </div>
                <ul className="space-y-2 text-[var(--foreground)]">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span>생체신호 모니터링</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span>미이동 감지</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                    <span>수면 패턴 분석</span>
                  </li>
                </ul>
              </Card>

            {/* Card 3 - Privacy */}
            <Card className="glass-card p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Lock className="h-10 w-10 text-purple-400" />
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--foreground)]">프라이버시</h3>
                    <p className="text-sm text-[var(--muted)]">Privacy</p>
                  </div>
                </div>
                <ul className="space-y-2 text-[var(--foreground)]">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>카메라 없음</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>로컬 데이터 처리</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>착용 기기 불필요</span>
                  </li>
                </ul>
              </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[var(--background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[var(--foreground)]">How It Works</h2>
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <Wifi className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">ESP32-S3 설치</h3>
                <p className="text-[var(--muted)]">설치하고 WiFi에 연결하세요</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">WiFi 신호 분석</h3>
                <p className="text-[var(--muted)]">RuView 엔진이 WiFi 신호를 분석합니다</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full flex items-center justify-center">
                  <Eye className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">대시보드 확인</h3>
                <p className="text-[var(--muted)]">실시간으로 보안과 돌봄 데이터를 확인하세요</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Badges */}
      <section className="py-16 bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-[var(--foreground)]">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">Next.js</Badge>
            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">RuView</Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">ESP32-S3</Badge>
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">TypeScript</Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Tailwind CSS</Badge>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[var(--surface)] border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">WE</span>
              </div>
              <span className="text-xl font-bold text-[var(--foreground)]">WifeEye</span>
            </div>

            {/* Description */}
            <p className="text-center text-[var(--muted)]">
              WifeEye — WiFi 기반 프라이버시 우선 돌봄·보안 플랫폼
            </p>

            {/* License */}
            <p className="text-sm text-[var(--muted)]">
              MIT License
            </p>

            {/* GitHub Link */}
            <div className="flex items-center space-x-2 text-[var(--primary)] hover:text-[var(--accent)] transition-colors">
              <span>GitHub에서 더 보기</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}