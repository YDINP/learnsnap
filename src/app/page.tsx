import Link from 'next/link';
import { getAllLearnCards } from '@/lib/content';
import { CATEGORIES } from '@/lib/categories';

export default function Home() {
  const cards = getAllLearnCards();

  return (
    <main className="min-h-dvh bg-[#0d0d0d] text-white">
      {/* 헤더 */}
      <div className="px-6 pt-16 pb-8">
        <h1 className="text-2xl font-bold mb-1">LearnSnap</h1>
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

      {/* 카테고리별 */}
      <div className="px-6 space-y-8 pb-16">
        {CATEGORIES.map(cat => {
          const catCards = cards.filter(c => c.category === cat.key);
          if (catCards.length === 0) return null;
          return (
            <section key={cat.key}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </h2>
                <Link
                  href="/feed"
                  className="text-xs px-3 py-1 rounded-full border transition-colors hover:opacity-80"
                  style={{ borderColor: `${cat.accent}40`, color: cat.accent }}
                >
                  전체 보기 →
                </Link>
              </div>
              <div className="space-y-2">
                {catCards.slice(0, 5).map(card => (
                  <Link
                    key={card.slug}
                    href={`/${card.category}/${card.slug}`}
                    className="flex items-center gap-3 rounded-xl bg-[#1a1a1a] border border-gray-800/60 px-4 py-3 hover:border-gray-700 transition-colors active:scale-[0.98]"
                  >
                    <span className="text-xl shrink-0">{card.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white/90 truncate">{card.title}</p>
                      {card.description && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">{card.description}</p>
                      )}
                    </div>
                    <span className="text-gray-600 text-xs shrink-0">{card.steps.length}p</span>
                  </Link>
                ))}
                {catCards.length > 5 && (
                  <Link
                    href="/feed"
                    className="block text-center py-2 text-xs rounded-xl border border-gray-800/40 hover:border-gray-700 transition-colors"
                    style={{ color: cat.accent }}
                  >
                    + {catCards.length - 5}개 더 보기
                  </Link>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
