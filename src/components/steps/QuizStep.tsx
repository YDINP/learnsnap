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
    <div className="bg-violet-50 rounded-2xl p-5 my-4">
      <div className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-3">퀴즈</div>
      <p className="text-gray-800 font-medium mb-4">{question}</p>
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
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : isSelected
                    ? 'bg-red-100 border-red-400 text-red-800'
                    : 'bg-white border-gray-200 text-gray-400'
                  : 'bg-white border-gray-200 hover:border-violet-400 text-gray-700'
              }`}
            >
              <span className="font-bold mr-2">{opt.key})</span>{opt.text}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className={`mt-3 text-sm font-medium ${selected === answer ? 'text-emerald-600' : 'text-red-600'}`}>
          {selected === answer ? '정답입니다!' : `오답. 정답: ${answer}`}
        </p>
      )}
    </div>
  );
}
