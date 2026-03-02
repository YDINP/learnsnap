import { CategoryInfo } from '@/types/content';

export const CATEGORIES: CategoryInfo[] = [
  { key: 'literature', label: '국문학', emoji: '📖', gradient: 'from-rose-500 to-pink-600', accent: '#F43F5E' },
  { key: 'grammar', label: '문법', emoji: '✏️', gradient: 'from-blue-500 to-indigo-600', accent: '#3B82F6' },
  { key: 'knowledge', label: '상식', emoji: '💡', gradient: 'from-amber-400 to-orange-500', accent: '#F59E0B' },
  { key: 'archaic', label: '그때 그 말', emoji: '📟', gradient: 'from-violet-500 to-purple-600', accent: '#8B5CF6' },
  { key: 'hanja', label: '한자어', emoji: '🀄', gradient: 'from-emerald-500 to-teal-600', accent: '#10B981' },
];

export function getCategoryInfo(key: string): CategoryInfo | undefined {
  return CATEGORIES.find(c => c.key === key);
}
