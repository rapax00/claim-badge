import { useEffect, useState } from 'react';
import { convertNostrToolsEventToBadgeDefinition } from '@/lib/nostr';
import { BadgeDefinition } from '@/types/badge';
import { Filter, Relay } from 'nostr-tools';

export interface useSubscriptionProps {
  filters: Filter[];
}

export interface useSubscriptionReturn {
  badges: BadgeDefinition[];
  loading: boolean;
  error: string | null;
}

const relaysUrl = [
  'wss://relay.hodl.ar',
  // 'wss://nos.lol',
  // 'wss://relay.damus.io',
];

export const useSearchBadges = (
  params: useSubscriptionProps
): useSubscriptionReturn => {
  const { filters } = params;

  console.log('filters:', filters);

  const [badges, setBadges] = useState<BadgeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const allBadges: BadgeDefinition[] = [];

        for (const url of relaysUrl) {
          const relay = await Relay.connect(url);

          console.log(
            '|--',
            '\n| Connected to relay:',
            '\n| url:',
            relay.url,
            '\n|--'
          );

          const sub = relay.subscribe(filters, {
            onevent(event) {
              console.log('Event received:', event);

              const existingBadge = allBadges.find(
                (badge) => badge.id === event.id
              );

              if (existingBadge) {
                // Update badge if event is newer
                if (event.created_at > existingBadge.created_at) {
                  allBadges.push(
                    convertNostrToolsEventToBadgeDefinition(event)
                  );
                }
              } else {
                allBadges.push(convertNostrToolsEventToBadgeDefinition(event));
              }

              setBadges([...allBadges]);
            },
            oneose() {
              sub.close();
            },
          });
        }
      } catch (err) {
        setError('Error fetching badges');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [filters]);

  return { badges, loading, error };
};
