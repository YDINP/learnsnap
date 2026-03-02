import { CardStep } from '@/types/content';
import { ConceptStep } from '@/components/steps/ConceptStep';
import { ExampleStep } from '@/components/steps/ExampleStep';
import { QuizStep } from '@/components/steps/QuizStep';
import { FormulaStep } from '@/components/steps/FormulaStep';
import { MemoryTipStep } from '@/components/steps/MemoryTipStep';
import { SummaryStep } from '@/components/steps/SummaryStep';

interface Props {
  step: CardStep;
}

export function LearnRenderer({ step }: Props) {
  switch (step.type) {
    case 'concept': return <ConceptStep content={step.content} />;
    case 'example': return <ExampleStep content={step.content} />;
    case 'quiz': return <QuizStep content={step.content} />;
    case 'formula': return <FormulaStep content={step.content} />;
    case 'memory-tip': return <MemoryTipStep content={step.content} />;
    case 'summary': return <SummaryStep content={step.content} />;

    case 'cinematic-hook':
    case 'narration':
    case 'impact':
    case 'fact':
    case 'outro':
      return (
        <div className="py-4">
          <p className="text-gray-200 text-base leading-relaxed whitespace-pre-line">{step.content}</p>
        </div>
      );

    case 'vs':
    case 'stat':
    case 'data-viz':
      return (
        <div className="bg-[#242424] rounded-xl p-4 my-3 border border-gray-800">
          <p className="text-gray-300 text-sm whitespace-pre-line">{step.content}</p>
        </div>
      );

    case 'reveal-title':
      return (
        <div className="text-center py-6">
          <p className="text-2xl font-bold text-white">{step.content}</p>
        </div>
      );

    case 'steps':
      return (
        <div className="bg-[#242424] rounded-xl p-4 my-3 border border-gray-800">
          <p className="text-gray-300 text-sm whitespace-pre-line">{step.content}</p>
        </div>
      );

    default:
      return <p className="text-gray-400 py-2">{step.content}</p>;
  }
}
