'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CardMeta } from '@/types/content';
import { CATEGORIES } from '@/lib/categories';

export default function BrowseClient({ cards }: { cards: CardMeta[] }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="px-6 space-y-8 pb-16">
      {CATEGORIES.map(cat => {
        const catCards = cards.filter(c => c.category === cat.key);
        if (catCards.length === 0) return null;
        const isExpanded = expanded[cat.key];
        const visible = isExpanded ? catCards : catCards.slice(0, 5);

        return (
          <section key={cat.key}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </h2>
              {catCards.length > 5 && (
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [cat.key]: !prev[cat.key] }))}
                  className="text-xs px-3 py-1 rounded-full border transition-colors hover:opacity-80"
                  style={{ borderColor: `${cat.accent}40`, color: cat.accent }}
                >
                  {isExpanded ? '접기 ↑' : '전체 보기 →'}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {visible.map(card => (
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
              {!isExpanded && catCards.length > 5 && (
                <button
                  onClick={() => setExpanded(prev => ({ ...prev, [cat.key]: true }))}
                  className="block w-full text-center py-2 text-xs rounded-xl border border-gray-800/40 hover:border-gray-700 transition-colors"
                  style={{ color: cat.accent }}
                >
                  + {catCards.length - 5}개 더 보기
                </button>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
