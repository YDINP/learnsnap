import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LearnSnap — 교육 숏폼 카드',
  description: '수학, 과학, 역사 등 핵심 개념을 짧고 명확하게',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
