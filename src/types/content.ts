export type CategoryKey = 'grammar' | 'knowledge' | 'hanja' | 'idiom' | 'spelling' | 'math' | 'science' | 'history';
export type Difficulty = 1 | 2 | 3;

// 재사용 스텝 타입 (SnapWise 호환)
export type SharedStepType = 'cinematic-hook' | 'narration' | 'impact' | 'fact' | 'vs' | 'stat' | 'data-viz' | 'reveal-title' | 'outro';

// LearnSnap 전용 스텝 타입
export type LearnStepType = 'concept' | 'example' | 'quiz' | 'formula' | 'steps' | 'memory-tip' | 'summary' | 'story' | 'behind' | 'real-world' | 'why-matter';

// 전체 스텝 타입 유니언
export type StepType = SharedStepType | LearnStepType;

export interface CardStep {
  type: StepType;
  content: string;
}

export interface CardMeta {
  title: string;
  slug: string;
  emoji: string;
  category: CategoryKey;
  tags: string[];
  difficulty: Difficulty;
  pubDate: string;
  steps: CardStep[];
  learningGoal?: string;
  estimatedMinutes?: number;
  prerequisites?: string[];
  description?: string;
  draft?: boolean;
}

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  emoji: string;
  gradient: string;
  accent: string;
}
