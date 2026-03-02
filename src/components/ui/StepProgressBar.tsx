'use client';

interface StepProgressBarProps {
  totalSteps: number;
  currentStep: number;
  accentColor?: string;
  onJump?: (index: number) => void;
}

export function StepProgressBar({
  totalSteps,
  currentStep,
  accentColor = '#6366f1',
  onJump,
}: StepProgressBarProps) {
  return (
    <div className="flex gap-1 px-3 pt-2 pb-1">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        return (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              onJump?.(i);
            }}
            aria-label={`${i + 1}번째 스텝으로 이동`}
            className="relative h-1 flex-1 rounded-full overflow-hidden bg-white/20 transition-all"
          >
            {/* 완료된 세그먼트 */}
            {isCompleted && (
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: accentColor, opacity: 0.8 }}
              />
            )}
            {/* 현재 세그먼트 — 애니메이션 진행 표시 */}
            {isActive && (
              <span
                className="absolute inset-0 rounded-full animate-pulse"
                style={{ backgroundColor: accentColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
