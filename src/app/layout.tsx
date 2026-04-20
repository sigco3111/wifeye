import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WifeEye — WiFi 기반 프라이버시 우선 돌봄·보안 플랫폼",
  description:
    "카메라 없이 WiFi 신호만으로 보안과 돌봄을 실현하는 오픈소스 플랫폼. RuView와 ESP32-S3로 구동됩니다.",
  keywords: ["wifeye", "wifi sensing", "privacy", "care", "security", "ruview", "esp32"],
  openGraph: {
    title: "WifeEye",
    description: "WiFi가 당신의 눈이 됩니다. 카메라 없이, 착용 기기 없이.",
    type: "website",
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
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased min-h-screen"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {children}
      </body>
    </html>
  );
}
