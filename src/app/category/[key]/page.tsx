import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllLearnCards } from '@/lib/content';
import { CATEGORIES, getCategoryInfo } from '@/lib/categories';
import { CategoryKey } from '@/types/content';

interface Props {
  params: Promise<{ key: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ key: cat.key }));
}

export default async function CategoryPage({ params }: Props) {
  const { key } = await params;
  const cat = getCategoryInfo(key);
  if (!cat) notFound();

  const allCards = getAllLearnCards();
  const cards = allCards.filter(c => c.category === key as CategoryKey);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-gray-600 hover:text-gray-400 mb-4 inline-block">← 홈</Link>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{cat.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold text-white">{cat.label}</h1>
          <p className="text-sm text-gray-500">{cards.length}개 카드</p>
        </div>
      </div>
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
                {card.learningGoal && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{card.learningGoal}</p>
                )}
              </div>
              <div className="text-xs text-gray-600 shrink-0">{card.estimatedMinutes ?? 3}분</div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
