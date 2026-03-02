'use client';
import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CardMeta } from '@/types/content';
import { CATEGORIES } from '@/lib/categories';
import { LearnRenderer } from '@/components/learn/LearnRenderer';

interface Props {
  cards: CardMeta[];
}

export function FeedClient({ cards }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const card = cards[currentIndex];

  const goNextStep = useCallback(() => {
    if (!card) return;
    if (currentStep < card.steps.length - 1) {
      setCurrentStep(s => s + 1);
    } else if (currentIndex < cards.length - 1) {
      setCurrentIndex(i => i + 1);
      setCurrentStep(0);
    }
  }, [card, currentStep, currentIndex, cards.length]);

  const goPrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setCurrentStep(0);
    }
  }, [currentStep, currentIndex]);

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">카드가 없습니다.</p>
      </div>
    );
  }

  if (!card) return null;

  const cat = CATEGORIES.find(c => c.key === card.category);
  const step = card.steps[currentStep];
  const progress = card.steps.length > 0 ? ((currentStep + 1) / card.steps.length) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0d0d0d] flex flex-col"
      onClick={goNextStep}
    >
      {/* 상단 바 */}
      <div className="sticky top-0 z-10 bg-[#0d0d0d] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link href="/" onClick={e => e.stopPropagation()} className="text-gray-600 hover:text-gray-400">
          ✕
        </Link>
        <span className="text-sm text-gray-500">
          {cat?.emoji} {cat?.label}
        </span>
        <span className="text-sm text-gray-600">
          {currentIndex + 1}/{cards.length}
        </span>
      </div>

      {/* 진행바 */}
      <div className="h-0.5 bg-gray-800">
        <div
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 카드 내용 */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {/* 카드 헤더 (첫 스텝에만) */}
        {currentStep === 0 && (
          <div className="mb-4">
            <span className="text-4xl">{card.emoji}</span>
            <h2 className="text-xl font-bold text-white mt-2">{card.title}</h2>
            {card.learningGoal && (
              <p className="text-sm text-indigo-400 mt-1">🎯 {card.learningGoal}</p>
            )}
          </div>
        )}

        {/* 스텝 */}
        <div onClick={e => e.stopPropagation()}>
          {step && <LearnRenderer step={step} />}
        </div>
      </div>

      {/* 하단 네비 */}
      <div className="sticky bottom-0 bg-[#0d0d0d] border-t border-gray-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={e => { e.stopPropagation(); goPrevStep(); }}
          className="text-gray-600 hover:text-gray-300 px-4 py-2 rounded-xl text-sm disabled:opacity-30"
          disabled={currentIndex === 0 && currentStep === 0}
        >
          ← 이전
        </button>
        <span className="text-xs text-gray-600">
          {currentStep + 1} / {card.steps.length}
        </span>
        <button
          onClick={e => { e.stopPropagation(); goNextStep(); }}
          className="text-indigo-400 hover:text-indigo-300 px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-30"
          disabled={currentIndex === cards.length - 1 && currentStep === card.steps.length - 1}
        >
          다음 →
        </button>
      </div>
    </div>
  );
}
