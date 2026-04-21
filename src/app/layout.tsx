import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WifeEye — WiFi 기반 프라이버시 우선 돌봄·보안 플랫폼",
  description: "카메라 없이 WiFi 신호만으로 보안과 돌봄을 실현하는 오픈소스 플랫폼",
  keywords: "WifeEye, WiFi, 보안, 돌봄, 프라이버시, 오픈소스, 무료, ESP32-S3, RuView",
  openGraph: {
    title: "WifeEye — WiFi 기반 프라이버시 우선 돌봄·보안 플랫폼",
    description: "카메라 없이 WiFi 신호만으로 보안과 돌봄을 실현하는 오픈소스 플랫폼",
    type: "website",
    url: "https://wifeye.app",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "WifeEye",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {children}
      </body>
    </html>
  );
}
