import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getLearnCard, getAllLearnCards } from '@/lib/content';
import { LearnRenderer } from '@/components/learn/LearnRenderer';
import { CATEGORIES } from '@/lib/categories';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const cards = getAllLearnCards();
  return cards.map(card => ({ category: card.category, slug: card.slug }));
}

export default async function CardPage({ params }: Props) {
  const { category, slug } = await params;
  const card = getLearnCard(category, slug);
  if (!card) notFound();

  const cat = CATEGORIES.find(c => c.key === card.category);
  const difficultyLabel = ['', '입문', '기초', '심화'][card.difficulty] ?? '기초';

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      {/* 상단 네비 */}
      <div className="flex items-center gap-2 mb-4">
        <Link href={`/category/${card.category}`} className="text-sm text-gray-400 hover:text-gray-600">
          ← {cat?.label}
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* 카드 헤더 */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <span className="text-4xl">{card.emoji}</span>
            <div className="flex gap-2 text-xs">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{difficultyLabel}</span>
              <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">{card.estimatedMinutes ?? 3}분</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{card.title}</h1>
          {card.learningGoal && (
            <p className="text-sm text-indigo-600 font-medium">🎯 {card.learningGoal}</p>
          )}
          {card.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap mt-3">
              {card.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* 스텝 목록 */}
        <div className="p-6 space-y-2">
          {card.steps.map((step, i) => (
            <LearnRenderer key={i} step={step} />
          ))}
        </div>
      </div>

      {/* 피드로 이동 */}
      <div className="text-center mt-6">
        <Link
          href="/feed"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          스와이프 피드로 더 보기 ↕
        </Link>
      </div>
    </main>
  );
}
