'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CardStep, CardMeta } from '@/types/content';
import { CATEGORIES } from '@/lib/categories';

/** 마크다운 강조 문법을 제거하고 일반 텍스트로 반환 */
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')  // **bold** 제거
    .replace(/\*(.*?)\*/g, '$1')       // *italic* 제거
    .replace(/__(.*?)__/g, '$1')       // __bold__ 제거
    .replace(/_(.*?)_/g, '$1')         // _italic_ 제거
    .replace(/`(.*?)`/g, '$1')         // `code` 제거
    .trim();
}

interface Props {
  step: CardStep;
  card: CardMeta;
  isActive: boolean;
  stepIndex: number;
  totalSteps: number;
  isLastCard?: boolean;
}

/* ────────────────────────────────────────────────────────
   개별 스텝 렌더러들
   ──────────────────────────────────────────────────────── */

/** cinematic-hook — 풀스크린 드라마틱 훅 */
function CinematicHookView({ step, card, isActive }: { step: CardStep; card: CardMeta; isActive: boolean }) {
  const cat = CATEGORIES.find(c => c.key === card.category);
  const lines = step.content.split('\n').filter(l => l.trim());

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6">
      {/* 배경 그라데이션 글로우 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: cat ? `${cat.accent}15` : '#6366f115' }}
        />
      </motion.div>

      {/* 카드 이모지 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl mb-6 relative z-10"
      >
        {card.emoji}
      </motion.div>

      {/* 훅 텍스트 */}
      <motion.div
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
        }}
        className="relative z-10 flex flex-col items-center gap-2 text-center w-full"
      >
        {lines.map((line, i) => (
          <motion.p
            key={i}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
            }}
            className="text-base md:text-lg font-medium text-white/90 leading-relaxed break-words"
            style={{ wordBreak: 'keep-all' }}
          >
            {stripMarkdown(line)}
          </motion.p>
        ))}
      </motion.div>

      {/* 탭 힌트 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-20 left-0 right-0 flex justify-center"
      >
        <motion.div
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="rounded-full bg-white/10 backdrop-blur-sm px-5 py-2 text-xs text-white/50 font-medium"
        >
          탭하면 다음 →
        </motion.div>
      </motion.div>
    </div>
  );
}

/** concept — 핵심 개념 */
function ConceptView({ step, isActive }: { step: CardStep; isActive: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-blue-950/50 border-l-4 border-blue-500 rounded-r-2xl p-5"
      >
        <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">핵심 개념</div>
        <p className="text-gray-200 text-base leading-relaxed whitespace-pre-line break-words">{stripMarkdown(step.content)}</p>
      </motion.div>
    </div>
  );
}

/** example — 예시 */
function ExampleView({ step, isActive }: { step: CardStep; isActive: boolean }) {
  const lines = step.content.split('\n').filter(Boolean);
  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <div className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-3 px-1">예시</div>
      <motion.div
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
        className="space-y-2"
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, x: -8 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
            }}
            className="flex gap-3 items-start bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-3"
          >
            <span className="text-emerald-500 font-bold mt-0.5 shrink-0">•</span>
            <p className="text-gray-300 text-sm leading-relaxed break-words">{stripMarkdown(line.replace(/^[-•✅]\s*/, ''))}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/** quiz — 퀴즈 인터랙션 */
function QuizView({ step, isActive }: { step: CardStep; isActive: boolean }) {
  const [selected, setSelected] = useState<string | null>(null);

  const lines = step.content.split('\n').filter(Boolean);
  const question = lines[0] ?? '';
  const options: { key: string; text: string }[] = [];
  let answer = '';
  for (const line of lines.slice(1)) {
    const optMatch = line.match(/^([A-D])\)\s*(.+)/);
    if (optMatch) options.push({ key: optMatch[1], text: optMatch[2] });
    const ansMatch = line.match(/^ANSWER:([A-D])/);
    if (ansMatch) answer = ansMatch[1];
  }

  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-violet-950/50 border border-violet-900/50 rounded-2xl p-5"
      >
        <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3">퀴즈</div>
        <p className="text-gray-200 font-medium mb-5 leading-relaxed break-words">{stripMarkdown(question)}</p>
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          {options.map((opt) => {
            const isSelected = selected === opt.key;
            const isCorrect = opt.key === answer;
            const showResult = selected !== null;
            return (
              <button
                key={opt.key}
                onClick={() => !selected && setSelected(opt.key)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border-2 ${
                  showResult
                    ? isCorrect
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : isSelected
                        ? 'bg-red-950/60 border-red-500 text-red-300'
                        : 'bg-[#1a1a1a] border-gray-800 text-gray-600'
                    : 'bg-[#1a1a1a] border-gray-800 hover:border-violet-600 text-gray-300 active:scale-[0.98]'
                }`}
              >
                <span className="font-bold mr-2">{opt.key})</span>{stripMarkdown(opt.text)}
              </button>
            );
          })}
        </div>
        {selected && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-sm font-medium ${selected === answer ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {selected === answer ? '✓ 정답입니다!' : `✗ 오답. 정답: ${answer}`}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

/** formula — 공식/규칙 */
function FormulaView({ step, isActive }: { step: CardStep; isActive: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-4">공식 / 규칙</div>
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-2xl p-6">
          <p className="font-mono text-base md:text-xl font-bold text-amber-300 whitespace-pre-line leading-relaxed break-words">
            {stripMarkdown(step.content)}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/** memory-tip — 암기 팁 */
function MemoryTipView({ step, isActive }: { step: CardStep; isActive: boolean }) {
  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-amber-950/30 border border-amber-800/50 rounded-2xl p-5 flex gap-4"
      >
        <motion.span
          initial={{ scale: 0.5, rotate: -15 }}
          animate={isActive ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2, type: 'spring' }}
          className="text-3xl shrink-0"
        >
          💡
        </motion.span>
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">암기 팁</div>
          <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line break-words">{stripMarkdown(step.content)}</p>
        </div>
      </motion.div>
    </div>
  );
}

/** steps — 단계별 절차 */
function StepsView({ step, isActive }: { step: CardStep; isActive: boolean }) {
  const lines = step.content.split('\n').filter(Boolean);
  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 px-1">단계별</div>
      <motion.div
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-2"
      >
        {lines.map((line, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0, transition: { duration: 0.35 } } }}
            className="flex gap-3 items-start"
          >
            <span className="w-6 h-6 rounded-full bg-cyan-900/70 border border-cyan-700 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0 mt-0.5">
              {i + 1}
            </span>
            <p className="text-gray-300 text-sm pt-0.5 leading-relaxed break-words">{stripMarkdown(line.replace(/^\d+[.)]\s*/, ''))}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

/** summary — 핵심 정리 (풀스크린 시네마틱) */
function SummaryView({ step, card, isActive }: { step: CardStep; card: CardMeta; isActive: boolean }) {
  const cat = CATEGORIES.find(c => c.key === card.category);
  const accent = cat?.accent ?? '#6366f1';
  const points = step.content.split('\n').filter(Boolean);

  return (
    <div className="relative flex h-full w-full flex-col justify-center overflow-hidden px-5 py-8">
      {/* 배경 글로우 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${accent}18` }}
        />
      </motion.div>

      {/* 상단 타이틀 */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="relative z-10 flex flex-col items-center gap-1 mb-7 text-center"
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isActive ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 220 }}
          className="text-4xl mb-1"
        >
          {card.emoji}
        </motion.span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>✦</span>
          <span className="text-xs font-bold tracking-[0.18em] uppercase" style={{ color: accent }}>핵심 정리</span>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>✦</span>
        </div>
      </motion.div>

      {/* 포인트 카드 목록 */}
      <motion.ol
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.28 } },
        }}
        className="relative z-10 flex flex-col gap-3"
      >
        {points.map((p, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease: 'easeOut' } },
            }}
            className="flex items-start gap-3 rounded-xl px-4 py-3"
            style={{
              backgroundColor: `${accent}10`,
              border: `1px solid ${accent}28`,
            }}
          >
            {/* 번호 배지 */}
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-black mt-0.5"
              style={{ backgroundColor: accent }}
            >
              {i + 1}
            </span>
            <span className="text-[15px] text-gray-200 leading-relaxed break-words" style={{ wordBreak: 'keep-all' }}>
              {stripMarkdown(p.replace(/^\d+\.\s*/, ''))}
            </span>
          </motion.li>
        ))}
      </motion.ol>

      {/* 하단 카드 타이틀 fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.28 + points.length * 0.12 + 0.2 }}
        className="relative z-10 mt-6 flex flex-col items-center gap-1 text-center"
      >
        <div className="h-px w-10 mb-2" style={{ backgroundColor: `${accent}50` }} />
        <p className="text-[13px] font-medium" style={{ color: `${accent}CC` }}>
          ✦ {card.title}
        </p>
      </motion.div>
    </div>
  );
}

/** impact — 임팩트 포인트 (풀스크린) */
function ImpactView({ step, card, isActive }: { step: CardStep; card: CardMeta; isActive: boolean }) {
  const cat = CATEGORIES.find(c => c.key === card.category);
  const lines = step.content.split('\n').filter(l => l.trim());
  const fontSize = lines.length <= 3 ? 'text-2xl' : lines.length <= 5 ? 'text-xl' : 'text-lg';

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isActive ? { opacity: [1, 0.6, 1], scale: [1, 1.25, 1] } : { opacity: 0 }}
        transition={isActive ? { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 } : { duration: 0.3 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          className="h-72 w-72 rounded-full blur-3xl"
          style={{ backgroundColor: cat ? `${cat.accent}20` : '#6366f120' }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 w-full max-w-sm">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-0.5 w-12 origin-center"
          style={{ backgroundColor: cat?.accent ?? '#6366f1' }}
        />
        <motion.div
          initial="hidden"
          animate={isActive ? 'visible' : 'hidden'}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          className="flex flex-col items-center gap-3 w-full"
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className={`text-center ${fontSize} font-bold text-white/90 leading-relaxed break-words w-full`}
              style={{ wordBreak: 'keep-all' }}
            >
              {stripMarkdown(line)}
            </motion.p>
          ))}
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isActive ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 + lines.length * 0.08 }}
          className="h-0.5 w-12 origin-center"
          style={{ backgroundColor: cat?.accent ?? '#6366f1' }}
        />
      </div>
    </div>
  );
}

/** narration — 내레이션 텍스트 */
function NarrationView({ step, isActive }: { step: CardStep; isActive: boolean }) {
  const lines = step.content.split('\n').filter(l => l.trim());
  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <motion.div
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-3"
      >
        {lines.map((line, i) => (
          <motion.p
            key={i}
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
            className="text-gray-200 text-base leading-loose break-words"
            style={{ wordBreak: 'keep-all' }}
          >
            {stripMarkdown(line)}
          </motion.p>
        ))}
      </motion.div>
    </div>
  );
}

/** vs — 비교 카드 */
function VsView({ step, isActive }: { step: CardStep; isActive: boolean }) {
  const lines = step.content.split('\n').filter(Boolean);
  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1a1a1a] border border-gray-700/60 rounded-2xl p-5"
      >
        <div className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3">비교</div>
        <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed break-words">{stripMarkdown(step.content)}</p>
      </motion.div>
    </div>
  );
}

/** stat / data-viz / fact — 데이터 표시 */
function DataView({ step, isActive, label }: { step: CardStep; isActive: boolean; label: string }) {
  return (
    <div className="flex h-full w-full flex-col justify-center px-5 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#1a1a1a] border border-gray-700/60 rounded-2xl p-5"
      >
        <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3">{label}</div>
        <p className="text-gray-300 text-sm whitespace-pre-line leading-relaxed break-words">{stripMarkdown(step.content)}</p>
      </motion.div>
    </div>
  );
}

/** reveal-title — 타이틀 공개 */
function RevealTitleView({ step, card, isActive }: { step: CardStep; card: CardMeta; isActive: boolean }) {
  const cat = CATEGORIES.find(c => c.key === card.category);
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
        style={{
          background: cat
            ? `radial-gradient(ellipse at center, ${cat.accent}25 0%, transparent 70%)`
            : 'radial-gradient(ellipse at center, #6366f125 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          animate={isActive ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
          className="text-5xl"
        >
          {card.emoji}
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={isActive ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl font-bold text-white leading-relaxed break-words"
          style={{ wordBreak: 'keep-all' }}
        >
          {stripMarkdown(step.content)}
        </motion.p>
        {card.learningGoal && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="text-sm mt-2"
            style={{ color: cat?.accent ?? '#6366f1' }}
          >
            🎯 {card.learningGoal}
          </motion.p>
        )}
      </div>
    </div>
  );
}

/** outro — 완료 화면 */
function OutroView({ step, card, isActive, isLastCard }: { step: CardStep; card: CardMeta; isActive: boolean; isLastCard: boolean }) {
  const cat = CATEGORIES.find(c => c.key === card.category);
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-8">
      <div className="absolute inset-0 bg-black" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
        style={{
          background: cat
            ? `radial-gradient(ellipse at bottom, ${cat.accent}20 0%, transparent 60%)`
            : '',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={isActive ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 160 }}
          className="text-5xl"
        >
          ✅
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-lg font-bold text-white mb-1">학습 완료!</p>
          <p className="text-gray-400 text-sm">{card.title}</p>
        </motion.div>
        {step.content.trim() && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isActive ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-gray-400 text-sm leading-relaxed max-w-xs break-words"
          >
            {stripMarkdown(step.content)}
          </motion.p>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          className="text-xs mt-2"
          style={{ color: cat?.accent ?? '#6366f1', opacity: 0.7 }}
        >
          {isLastCard ? '모든 카드를 완료했습니다' : '탭하면 다음 카드로 이동 →'}
        </motion.p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   메인 라우터
   ──────────────────────────────────────────────────────── */

/** 스텝 타입에 따라 적절한 뷰 컴포넌트를 반환하는 헬퍼 */
function renderStep(step: CardStep, card: CardMeta, isActive: boolean, isLastCard: boolean) {
  switch (step.type) {
    case 'cinematic-hook':
      return <CinematicHookView step={step} card={card} isActive={isActive} />;
    case 'concept':
      return <ConceptView step={step} isActive={isActive} />;
    case 'example':
      return <ExampleView step={step} isActive={isActive} />;
    case 'quiz':
      return <QuizView step={step} isActive={isActive} />;
    case 'formula':
      return <FormulaView step={step} isActive={isActive} />;
    case 'memory-tip':
      return <MemoryTipView step={step} isActive={isActive} />;
    case 'steps':
      return <StepsView step={step} isActive={isActive} />;
    case 'summary':
      return <SummaryView step={step} card={card} isActive={isActive} />;
    case 'impact':
      return <ImpactView step={step} card={card} isActive={isActive} />;
    case 'narration':
      return <NarrationView step={step} isActive={isActive} />;
    case 'vs':
      return <VsView step={step} isActive={isActive} />;
    case 'stat':
      return <DataView step={step} isActive={isActive} label="통계" />;
    case 'data-viz':
      return <DataView step={step} isActive={isActive} label="데이터" />;
    case 'fact':
      return <DataView step={step} isActive={isActive} label="팩트" />;
    case 'reveal-title':
      return <RevealTitleView step={step} card={card} isActive={isActive} />;
    case 'outro':
      return <OutroView step={step} card={card} isActive={isActive} isLastCard={isLastCard} />;
    default:
      return (
        <div className="flex h-full w-full flex-col justify-center px-5 py-6">
          <p className="text-gray-200 text-base leading-relaxed whitespace-pre-line break-words">{stripMarkdown(step.content)}</p>
        </div>
      );
  }
}

export function SwipeStepRenderer({ step, card, isActive, stepIndex, totalSteps, isLastCard = false }: Props) {
  const cat = CATEGORIES.find(c => c.key === card.category);
  const isLastStep = stepIndex === totalSteps - 1;
  const isOutroType = step.type === 'outro';

  const rendered = renderStep(step, card, isActive, isLastCard);

  // 마지막 스텝이지만 outro 타입이 아닌 경우: 끝마치는 배지 오버레이 추가
  if (isLastStep && !isOutroType) {
    return (
      <div className="relative w-full h-full">
        {rendered}
        {/* 완료 배지 — 화면 상단에 고정 */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="pointer-events-none absolute top-0 left-0 right-0 flex justify-center pt-14 z-20"
        >
          <div
            className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold text-white/90"
            style={{ backgroundColor: `${cat?.accent ?? '#6366f1'}30`, border: `1px solid ${cat?.accent ?? '#6366f1'}50` }}
          >
            <span>✅</span>
            <span>학습 완료</span>
          </div>
        </motion.div>
        {/* 하단 완료 힌트 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="pointer-events-none absolute bottom-28 left-0 right-0 flex justify-center z-20"
        >
          <p className="text-xs font-medium" style={{ color: `${cat?.accent ?? '#6366f1'}90` }}>
            {isLastCard ? '모든 카드를 완료했어요 🎉' : '위로 스와이프하면 다음 카드 ↑'}
          </p>
        </motion.div>
      </div>
    );
  }

  return rendered;
}
