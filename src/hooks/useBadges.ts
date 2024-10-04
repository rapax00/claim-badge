import { BadgeDefinition, BadgeInfo } from '@/types/badge';

interface useBadgesProps {
  badgesInfo: BadgeInfo[];
}

interface useBadgesReturn {
  badges: BadgeDefinition[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useBadges = ({ badgesInfo }: useBadgesProps): useBadgesReturn => {
  /**
   * TODO:
   * - [ ] Interact with the Nostr to fetch the badges from BadgesInfo
   * - [ ] Use the convertToBadgeDefinition function to convert the NDKEvent to BadgeDefinition
   */

  // test
  const badges: BadgeDefinition[] = [
    {
      id: 'abcdef12345',
      name: 'BitAxe',
      description: 'Bitcoin lottery miner',
      image:
        'https://image.nostr.build/89164893e59537076170a9fccdeee7ac9e1160fcb88229b5f123b4df9325a560.jpg',
      width: 695,
      height: 927,
    },
    {
      id: '12345fedcba',
      name: 'Meat with eggs',
      description: 'Bitcioner`s food',
      image:
        'https://image.nostr.build/0e6744f4c40ab9bd8f76a1bd5b75fe8e988f2118810eb24745ae6cbe5b7509dd.jpg',
      width: 695,
      height: 927,
    },
    {
      id: '54321abcdef',
      name: 'Bitcoin Wizard',
      description: 'A Bitcoiner in the wild',
      image:
        'https://image.nostr.build/d91f4e604e402c9f5c567b8ca8b7abe73d659c8b3a1b23f1e2cc2d1967cb0672.jpg',
      width: 640,
      height: 640,
    },
  ];

  return {
    badges,
  };
};
