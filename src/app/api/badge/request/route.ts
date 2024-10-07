import { buildAwardEvent, requiredEnvVar } from '@/lib/utils';
import { hexToBytes } from '@noble/hashes/utils';
import NDK, {
  NDKEvent,
  NDKKind,
  NDKPrivateKeySigner,
} from '@nostr-dev-kit/ndk';
import { NextResponse } from 'next/server';
import { getPublicKey } from 'nostr-tools';
import { queryProfile } from 'nostr-tools/nip05';

const relaysList = ['wss://relay.damus.io', 'wss://relay.hodl.ar'];
const NOSTR_SIGNER = requiredEnvVar('NOSTR_SIGNER');

const handleErrorResponse = (message: string, status: number) => {
  return NextResponse.json({ error: message }, { status });
};

export async function POST(request: Request) {
  if (!NOSTR_SIGNER) return handleErrorResponse('Missing admin signer', 422);

  const params = await request.json();
  const { badgeId, nip05 } = params;

  if (!badgeId)
    return handleErrorResponse(
      'Missing badge definition event id (badgeId)',
      401
    );

  if (!nip05) return handleErrorResponse('Missing nip05 on request', 401);

  const nip05Profile = await queryProfile(nip05);
  if (!nip05Profile) return handleErrorResponse('Invalid nip05', 401);

  const signer = new NDKPrivateKeySigner(NOSTR_SIGNER);
  const signerPubkey = getPublicKey(hexToBytes(NOSTR_SIGNER));

  const ndk = new NDK({ explicitRelayUrls: relaysList, signer });
  await ndk.connect();

  const badgeDefinitionEvent = await ndk.fetchEvent({
    ids: [badgeId],
  });

  const badgeIdentifier =
    badgeDefinitionEvent?.getMatchingTags('d')[0]?.[1] ?? null;

  if (
    !badgeDefinitionEvent ||
    badgeDefinitionEvent.kind !== NDKKind.BadgeDefinition ||
    badgeDefinitionEvent.pubkey !== signerPubkey ||
    !badgeIdentifier
  )
    return handleErrorResponse(
      'Missing or invalid badge definition event',
      401
    );

  const badgeAddress = `${NDKKind.BadgeDefinition}:${signerPubkey}:${badgeIdentifier}`;
  const alreadyExistAward = await ndk.fetchEvent({
    kinds: [NDKKind.BadgeAward],
    authors: [signerPubkey],
    '#a': [badgeAddress],
    '#p': [nip05Profile.pubkey],
  });

  if (alreadyExistAward)
    return handleErrorResponse(
      'The award event has already been sent for this nip05',
      401
    );

  const awardEvent: NDKEvent = new NDKEvent(
    ndk,
    buildAwardEvent(badgeAddress, signerPubkey, nip05Profile.pubkey)
  );

  await awardEvent.sign();
  await awardEvent.publish();

  if (awardEvent.publishStatus === 'error')
    return handleErrorResponse(
      'An error occurred while trying to publish the award event',
      401
    );

  return NextResponse.json(
    { message: await awardEvent.toNostrEvent() },
    { status: 200 }
  );
}
