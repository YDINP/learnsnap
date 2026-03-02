'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { CardMeta } from '@/types/content';
import { CATEGORIES } from '@/lib/categories';
import { StepProgressBar } from '@/components/ui/StepProgressBar';
import { SwipeStepRenderer } from '@/components/learn/SwipeStepRenderer';

interface Props {
  cards: CardMeta[];
}

/** 스텝 타입에 따른 전환 variant */
type TransitionVariant = 'snap' | 'zoom' | 'dramatic' | 'default';

function getTransitionVariant(stepType: string): TransitionVariant {
  if (stepType === 'fact' || stepType === 'data-viz') return 'snap';
  if (stepType === 'cinematic-hook' || stepType === 'impact') return 'zoom';
  if (stepType === 'reveal-title') return 'dramatic';
  return 'default';
}

interface MotionConfig {
  initial: { opacity: number; scale?: number; y?: number };
  animate: { opacity: number; scale?: number; y?: number };
  exit: { opacity: number; scale?: number; y?: number };
  duration: number;
}

function getMotionConfig(variant: TransitionVariant, direction: 1 | -1): MotionConfig {
  switch (variant) {
    case 'snap':
      return {
        initial: { opacity: 0.7 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        duration: 0.06,
      };
    case 'zoom':
      return {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.03 },
        duration: 0.28,
      };
    case 'dramatic':
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        duration: 0.55,
      };
    default:
      return {
        initial: { opacity: 0, y: direction > 0 ? 6 : -6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: direction > 0 ? -6 : 6 },
        duration: 0.18,
      };
  }
}

/** 카드→카드 세로 전환 motion 설정 */
const CARD_CHANGE_MOTION: MotionConfig = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 },
  duration: 0.32,
};

/** Fisher-Yates shuffle — 클라이언트에서 1회 실행 */
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function FeedClient({ cards }: Props) {
  const [shuffledCards] = useState(() => shuffleArray(cards));
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isCardTransition, setIsCardTransition] = useState(false);
  const [showTapHint, setShowTapHint] = useState(false);
  const [showProgressHint, setShowProgressHint] = useState(false);
  const [showCardInfo, setShowCardInfo] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const card = shuffledCards[currentCardIndex];
  const cat = card ? CATEGORIES.find(c => c.key === card.category) : undefined;
  const isLastCard = currentCardIndex === shuffledCards.length - 1;

  /* ── 탭 힌트 (처음 카드, 처음 스텝에서 2.5초 후 fade-out) ── */
  useEffect(() => {
    if (currentStep === 0 && currentCardIndex === 0) {
      setShowTapHint(true);
      const timer = setTimeout(() => setShowTapHint(false), 2500);
      return () => clearTimeout(timer);
    } else {
      setShowTapHint(false);
    }
  }, [currentStep, currentCardIndex]);

  /* ── 카드 전환 시 카드 정보 오버레이 (2.5초) ── */
  useEffect(() => {
    setShowCardInfo(true);
    const timer = setTimeout(() => setShowCardInfo(false), 2500);
    return () => clearTimeout(timer);
  }, [currentCardIndex]);

  /* ── 진행 힌트 화살표 (3초 정지 후 등장) ── */
  const resetHintTimer = useCallback(() => {
    setShowProgressHint(false);
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShowProgressHint(true), 3000);
  }, []);

  useEffect(() => {
    resetHintTimer();
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    };
  }, [currentStep, currentCardIndex, resetHintTimer]);

  /* ── 네비게이션 ── */
  const goNext = useCallback(() => {
    if (!card) return;
    setDirection(1);
    if (currentStep < card.steps.length - 1) {
      setIsCardTransition(false);
      setCurrentStep(s => s + 1);
    } else if (currentCardIndex < shuffledCards.length - 1) {
      setIsCardTransition(true);
      setCurrentCardIndex(i => i + 1);
      setCurrentStep(0);
    }
  }, [card, currentStep, currentCardIndex, shuffledCards.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    if (currentStep > 0) {
      setIsCardTransition(false);
      setCurrentStep(s => s - 1);
    } else if (currentCardIndex > 0) {
      const prevCard = shuffledCards[currentCardIndex - 1];
      setIsCardTransition(true);
      setCurrentCardIndex(i => i - 1);
      setCurrentStep(prevCard ? prevCard.steps.length - 1 : 0);
    }
  }, [currentStep, currentCardIndex, shuffledCards]);

  const goToStep = useCallback((index: number) => {
    if (!card) return;
    setDirection(index > currentStep ? 1 : -1);
    setIsCardTransition(false);
    setCurrentStep(index);
  }, [card, currentStep]);

  const isFirst = currentCardIndex === 0 && currentStep === 0;
  const isLast = isLastCard && card ? currentStep === card.steps.length - 1 : false;

  /* ── 터치 핸들러 ── */
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isSwiping.current = false;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;

    // 가로 스와이프 (스텝 이동) — 임계값 40px (모바일 최적화)
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      isSwiping.current = true;
      resetHintTimer();
      if (dx < 0) goNext();
      else goPrev();
    }
    // 세로 스와이프 위로 (다음 카드로 직접 이동)
    else if (dy < -60 && Math.abs(dy) > Math.abs(dx) * 1.4) {
      isSwiping.current = true;
      if (currentCardIndex < shuffledCards.length - 1) {
        setIsCardTransition(true);
        setCurrentCardIndex(i => i + 1);
        setCurrentStep(0);
        resetHintTimer();
      }
    }
    // 세로 스와이프 아래로 (이전 카드로 직접 이동)
    else if (dy > 60 && Math.abs(dy) > Math.abs(dx) * 1.4) {
      isSwiping.current = true;
      if (currentCardIndex > 0) {
        const prevCard = shuffledCards[currentCardIndex - 1];
        setIsCardTransition(true);
        setCurrentCardIndex(i => i - 1);
        setCurrentStep(prevCard ? prevCard.steps.length - 1 : 0);
        resetHintTimer();
      }
    }
  }, [goNext, goPrev, resetHintTimer, currentCardIndex, shuffledCards]);

  /* ── 탭 핸들러 (좌 30% = 이전, 우 70% = 다음) ── */
  const handleTap = useCallback((e: React.MouseEvent) => {
    if (isSwiping.current) { isSwiping.current = false; return; }
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    resetHintTimer();
    if (x < rect.width * 0.3) goPrev();
    else goNext();
  }, [goNext, goPrev, resetHintTimer]);

  /* ── 빈 상태 ── */
  if (shuffledCards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-[#0d0d0d]">
        <p className="text-gray-600">카드가 없습니다.</p>
      </div>
    );
  }

  if (!card) return null;

  const step = card.steps[currentStep];
  if (!step) return null;

  const stepType = step.type as string;
  const variant = getTransitionVariant(stepType);
  const isOutro = stepType === 'outro';

  // 카드→카드 전환 시 세로(y) 방향, 스텝 내 전환 시 기존 방향
  const motionCfg = isCardTransition ? CARD_CHANGE_MOTION : getMotionConfig(variant, direction);

  // AnimatePresence key: 카드 전환 시 card-{idx}, 스텝 전환 시 step-{cardIdx}-{stepIdx}
  const motionKey = isCardTransition
    ? `card-${currentCardIndex}`
    : `step-${currentCardIndex}-${currentStep}`;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh bg-[#0d0d0d] overflow-hidden flex flex-col"
      onClick={handleTap}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── 상단 오버레이 UI (z-50) ── */}
      <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
        {/* 세그먼트형 진행바 */}
        <div className="pointer-events-auto">
          <StepProgressBar
            totalSteps={card.steps.length}
            currentStep={currentStep}
            accentColor={cat?.accent ?? '#6366f1'}
            onJump={goToStep}
          />
        </div>

        {/* 카드 헤더 정보 */}
        <div className="flex items-center justify-between px-4 py-2 pointer-events-none">
          {/* 닫기 버튼 */}
          <Link
            href="/"
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto rounded-full bg-black/30 backdrop-blur-sm px-3 py-1.5 text-xs text-white/60 font-medium hover:bg-black/50 transition-colors"
          >
            ✕
          </Link>

          {/* 앱 브랜드 타이틀 */}
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-sm font-bold tracking-wide text-white/80">
              LearnSnap
            </span>
          </div>

          {/* 카드 인덱스 */}
          <span className="text-xs text-white/30 font-medium">
            {currentCardIndex + 1}/{shuffledCards.length}
          </span>
        </div>

        {/* 처음으로 버튼 */}
        {!isFirst && (
          <div className="px-4 pointer-events-auto">
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentCardIndex(0); setCurrentStep(0); }}
              className="rounded-full bg-black/30 backdrop-blur-sm px-4 py-1.5 text-xs text-white/50 hover:bg-black/50 transition-colors"
            >
              ← 처음으로
            </button>
          </div>
        )}
      </div>

      {/* ── 스텝 콘텐츠 (AnimatePresence) ── */}
      <div className="absolute inset-0">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={motionKey}
            initial={motionCfg.initial}
            animate={motionCfg.animate}
            exit={motionCfg.exit}
            transition={{ duration: motionCfg.duration, ease: 'easeOut' }}
            className="w-full h-full"
          >
            <SwipeStepRenderer
              step={step}
              card={card}
              isActive={true}
              stepIndex={currentStep}
              totalSteps={card.steps.length}
              isLastCard={isLastCard}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 하단 탭 영역 (z-40, 투명) ── */}
      {!isOutro && (
        <div
          className="absolute bottom-0 left-0 right-0 z-40"
          style={{ height: '18%' }}
          onClick={(e) => { e.stopPropagation(); resetHintTimer(); goNext(); }}
          aria-label="다음 스텝"
        />
      )}

      {/* ── 하단 네비게이션 바 (Safe Area 대응) ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50 flex items-center justify-between px-4 pt-4 pointer-events-none"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          disabled={isFirst}
          className="pointer-events-auto rounded-xl bg-black/30 backdrop-blur-sm px-5 py-2.5 text-sm text-white/60 font-medium hover:bg-black/50 transition-all disabled:opacity-20"
        >
          ← 이전
        </button>

        {/* 스텝 카운터 */}
        <span className="text-xs text-white/30 pointer-events-none">
          {currentStep + 1} / {card.steps.length}
        </span>

        {isLast ? (
          <Link
            href="/"
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-all"
            style={{ backgroundColor: cat?.accent ?? '#6366f1' }}
          >
            완료
          </Link>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            disabled={isLast}
            className="pointer-events-auto rounded-xl px-5 py-2.5 text-sm font-medium transition-all disabled:opacity-20"
            style={{
              backgroundColor: `${cat?.accent ?? '#6366f1'}22`,
              color: cat?.accent ?? '#6366f1',
              border: `1px solid ${cat?.accent ?? '#6366f1'}40`,
            }}
          >
            다음 →
          </button>
        )}
      </div>

      {/* ── 탭 힌트 오버레이 ── */}
      <AnimatePresence>
        {showTapHint && stepType !== 'cinematic-hook' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center pb-24"
          >
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-sm px-5 py-2.5 text-xs font-semibold text-white/70"
            >
              탭하면 다음 →
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 진행 힌트 화살표 (3초 정지 후) ── */}
      <AnimatePresence>
        {!isOutro && showProgressHint && (
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute right-4 top-1/2 z-30 -translate-y-1/2"
          >
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
              className="text-2xl"
              style={{ color: `${cat?.accent ?? '#6366f1'}60` }}
            >
              ›
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 카드 전환 시 카드 정보 오버레이 ── */}
      <AnimatePresence>
        {showCardInfo && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute bottom-32 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex flex-col items-center gap-1 rounded-2xl bg-black/60 backdrop-blur-sm px-5 py-3 text-center">
              <span className="text-2xl">{card.emoji}</span>
              <p className="text-sm font-bold text-white/90 break-words max-w-[200px]" style={{ wordBreak: 'keep-all' }}>
                {card.title}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: cat?.accent ?? '#6366f1' }}>
                  {cat?.emoji} {cat?.label}
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/40">
                  {step.type}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 세로 스와이프 힌트 (어느 스텝에서나 표시) ── */}
      <AnimatePresence>
        {!isLastCard && showProgressHint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute bottom-24 left-1/2 z-30 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="text-xl"
                style={{ color: `${cat?.accent ?? '#6366f1'}80` }}
              >
                ↑
              </span>
              <span
                className="text-[10px] font-medium"
                style={{ color: `${cat?.accent ?? '#6366f1'}60` }}
              >
                위로 스와이프
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
