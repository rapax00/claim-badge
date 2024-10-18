import { requiredEnvVar } from '@/lib/utils';
import { BadgeInfo } from '@/types/badge';
import Home from '@/components/Home';
import { InjectedNFCProvider } from '@/context/InjectedNFC';

const publicKey = requiredEnvVar('NOSTR_PUBLIC_KEY');

// Simple info for search badges
const badgesInfo: BadgeInfo[] = [
  {
    name: 'test-1',
    definitionId:
      'ab73a8fed4c7b2869b433e6e068d8316001cacd1ddea4769bb4dce1567d47eca',
  },
  {
    name: 'test-rock',
    definitionId:
      '8c107a72b82b64d045acfba156e0a22a843e40b0534efeb94efda54dabcd5c20',
  },
  {
    name: 'test-drug',
    definitionId:
      'a2b7f323372ced597d367f19522146cf1bdca36f21540662c45884984d1a0231',
  },
];

export default function Page() {
  return (
    <InjectedNFCProvider>
      <Home publicKey={publicKey} badgesInfo={badgesInfo} />
    </InjectedNFCProvider>
  );
}
