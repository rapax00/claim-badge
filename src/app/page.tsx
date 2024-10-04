import { BadgeCarousel } from '@/components/BadgeCarousel';
import { BadgeInfo } from '@/types/badge';

// Simple info for search badges
const badgesInfo: BadgeInfo[] = [
  { name: 'halloween', definitionId: 'abcdef12345' },
  { name: 'nostrbooth', definitionId: '12345fedcba' },
  { name: 'lacrypta', definitionId: '54321abcdef' },
];

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <BadgeCarousel badgesInfo={badgesInfo} />
    </div>
  );
}
