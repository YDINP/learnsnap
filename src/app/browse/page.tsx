import Link from 'next/link';
import { getAllLearnCards } from '@/lib/content';
import BrowseClient from './BrowseClient';

export default function BrowsePage() {
  const cards = getAllLearnCards();

  return (
    <main className="min-h-dvh bg-[#0d0d0d] text-white">
      {/* 헤더 */}
      <div className="px-6 pt-16 pb-8">
        <h1 className="text-2xl font-bold mb-1">전체 카드 보기</h1>
        <p className="text-gray-400 text-sm">매일 5분, 지식 한 스냅</p>
      </div>

      {/* 피드 CTA — 메인 */}
      <div className="px-6 mb-10">
        <Link
          href="/feed"
          className="block w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-5 text-center hover:opacity-90 transition-opacity active:scale-[0.98]"
        >
          <p className="text-lg font-bold mb-1">▶ 피드 시작하기</p>
          <p className="text-white/70 text-sm">카드 {cards.length}개 · 스와이프로 학습</p>
        </Link>
      </div>

      {/* 카테고리별 목록 (클라이언트: 더보기 토글) */}
      <BrowseClient cards={cards} />
    </main>
  );
}
