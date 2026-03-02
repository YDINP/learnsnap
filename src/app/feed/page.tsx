import { getAllLearnCards } from '@/lib/content';
import { FeedClient } from '@/components/feed/FeedClient';

export default function FeedPage() {
  const cards = getAllLearnCards();
  return <FeedClient cards={cards} />;
}
