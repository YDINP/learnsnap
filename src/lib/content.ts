import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CardMeta, CardStep, StepType, CategoryKey, Difficulty } from '@/types/content';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const VALID_STEP_TYPES: StepType[] = [
  'cinematic-hook', 'narration', 'impact', 'fact', 'vs', 'stat', 'data-viz', 'reveal-title', 'outro',
  'concept', 'example', 'quiz', 'formula', 'steps', 'memory-tip', 'summary'
];

function parseLearnSteps(content: string): CardStep[] {
  const steps: CardStep[] = [];
  const parts = content.split(/<!--\s*step:(\S+)\s*-->/);

  for (let i = 1; i < parts.length; i += 2) {
    const rawType = parts[i].trim();
    const stepContent = parts[i + 1]?.trim() ?? '';

    if (VALID_STEP_TYPES.includes(rawType as StepType)) {
      steps.push({ type: rawType as StepType, content: stepContent });
    } else {
      console.warn(`[LearnSnap] Unknown step type: "${rawType}" — skipping`);
    }
  }
  return steps;
}

export function getLearnCard(category: string, slug: string): CardMeta | null {
  const filePath = path.join(CONTENT_DIR, category, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    title: String(data.title ?? ''),
    slug,
    emoji: String(data.emoji ?? '📖'),
    category: (data.category ?? category) as CategoryKey,
    tags: Array.isArray(data.tags) ? data.tags : [],
    difficulty: (data.difficulty ?? 1) as Difficulty,
    pubDate: String(data.pubDate ?? '').slice(0, 10),
    steps: parseLearnSteps(content),
    learningGoal: data.learningGoal ? String(data.learningGoal) : undefined,
    estimatedMinutes: data.estimatedMinutes ? Number(data.estimatedMinutes) : undefined,
    prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : undefined,
    description: data.description ? String(data.description) : undefined,
    draft: Boolean(data.draft ?? false),
  };
}

export function getAllLearnCards(): CardMeta[] {
  const cards: CardMeta[] = [];

  if (!fs.existsSync(CONTENT_DIR)) return cards;

  const categories = fs.readdirSync(CONTENT_DIR);

  for (const category of categories) {
    const categoryDir = path.join(CONTENT_DIR, category);
    if (!fs.statSync(categoryDir).isDirectory()) continue;

    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'));

    for (const file of files) {
      const slug = file.replace('.mdx', '');
      const card = getLearnCard(category, slug);
      if (card && !card.draft) cards.push(card);
    }
  }

  return cards.sort((a, b) => b.pubDate.localeCompare(a.pubDate));
}
