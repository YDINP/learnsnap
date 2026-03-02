'use client';
import { useState } from 'react';

interface Props { content: string; }

function parseQuiz(content: string) {
  const lines = content.split('\n').filter(Boolean);
  const question = lines[0] ?? '';
  const options: { key: string; text: string }[] = [];
  let answer = '';

  for (const line of lines.slice(1)) {
    const optMatch = line.match(/^([A-D])\)\s*(.+)/);
    if (optMatch) options.push({ key: optMatch[1], text: optMatch[2] });
    const ansMatch = line.match(/^ANSWER:([A-D])/);
    if (ansMatch) answer = ansMatch[1];
  }

  return { question, options, answer };
}

export function QuizStep({ content }: Props) {
  const { question, options, answer } = parseQuiz(content);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-violet-950/40 rounded-2xl p-5 my-4 border border-violet-900/50">
      <div className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-3">퀴즈</div>
      <p className="text-gray-200 font-medium mb-4">{question}</p>
      <div className="space-y-2">
        {options.map(opt => {
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
                    ? 'bg-emerald-950/60 border-emerald-600 text-emerald-300'
                    : isSelected
                    ? 'bg-red-950/60 border-red-600 text-red-300'
                    : 'bg-[#1a1a1a] border-gray-800 text-gray-600'
                  : 'bg-[#1a1a1a] border-gray-800 hover:border-violet-600 text-gray-300'
              }`}
            >
              <span className="font-bold mr-2">{opt.key})</span>{opt.text}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className={`mt-3 text-sm font-medium ${selected === answer ? 'text-emerald-400' : 'text-red-400'}`}>
          {selected === answer ? '정답입니다!' : `오답. 정답: ${answer}`}
        </p>
      )}
    </div>
  );
}
