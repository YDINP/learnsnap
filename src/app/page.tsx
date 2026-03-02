import Link from 'next/link';
import { getAllLearnCards } from '@/lib/content';
import { CATEGORIES } from '@/lib/categories';

export default function Home() {
  const cards = getAllLearnCards();

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">LearnSnap</h1>
          <p className="text-gray-500 text-sm mt-1">핵심 개념을 짧고 명확하게</p>
        </div>
        {cards.length > 0 && (
          <Link
            href="/feed"
            className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-500 transition-colors"
          >
            스와이프 ↕
          </Link>
        )}
      </div>

      {/* 카테고리 그리드 */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.key}
            href={`/category/${cat.key}`}
            className="flex flex-col items-center gap-1 p-3 bg-[#1a1a1a] rounded-xl border border-gray-800 hover:border-gray-600 transition-colors"
          >
            <span className="text-2xl">{cat.emoji}</span>
            <span className="text-xs text-gray-400 text-center leading-tight">{cat.label}</span>
          </Link>
        ))}
      </div>

      {/* 최근 카드 목록 */}
      <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">최근 카드</h2>
      {cards.length === 0 ? (
        <p className="text-gray-600 text-center py-12">아직 카드가 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {cards.map(card => (
            <Link
              key={card.slug}
              href={`/${card.category}/${card.slug}`}
              className="flex items-center gap-4 bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 hover:border-gray-600 transition-colors"
            >
              <span className="text-3xl">{card.emoji}</span>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-gray-100 truncate">{card.title}</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {CATEGORIES.find(c => c.key === card.category)?.label} · {card.estimatedMinutes ?? 3}분
                </p>
              </div>
              <span className="text-gray-700 shrink-0">→</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
