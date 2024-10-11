import { BadgeCarousel } from '@/components/BadgeCarousel';
import { requiredEnvVar } from '@/lib/utils';
import { BadgeInfo } from '@/types/badge';

const publicKey = requiredEnvVar('NOSTR_PUBLIC_KEY');

// Simple info for search badges
const badgesInfo: BadgeInfo[] = [
  {
    name: 'test-1',
    definitionId:
      'ab73a8fed4c7b2869b433e6e068d8316001cacd1ddea4769bb4dce1567d47eca',
  },
];

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <BadgeCarousel publicKey={publicKey} badgesInfo={badgesInfo} />
    </div>
  );
}
