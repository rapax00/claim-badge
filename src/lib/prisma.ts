import { randomBytes } from 'crypto';
import { prisma } from './prismaClient';

async function createNonce(definitionId: string): Promise<string> {
  const nonce = await prisma.nonce.create({
    data: { value: randomBytes(32).toString('hex'), definitionId },
  });

  return nonce.value;
}

async function claimNonce(nonceValue: string): Promise<boolean> {
  return await prisma.$transaction(async (tx) => {
    const nonce = await tx.nonce.findUnique({ where: { value: nonceValue } });
    if (!nonce) {
      throw new Error('Nonce not found');
    }

    const currentTime = new Date();
    const creationTime = nonce.createdAt;
    const timeDifference =
      (currentTime.getTime() - creationTime.getTime()) / 1000; // Convert to seconds

    if (timeDifference > 60) {
      return false;
    }

    const nonceUpdate = await tx.nonce.update({
      where: { value: nonceValue },
      data: { usedAt: currentTime },
    });

    if (!nonceUpdate) {
      throw new Error('Failed to claim nonce');
    }

    return true;
  });
}

async function updateNonce(
  nonceValue: string,
  nip05: string
): Promise<boolean> {
  return await prisma.$transaction(async (tx) => {
    const nonceUpdate = await tx.nonce.update({
      where: {
        value: nonceValue,
      },
      data: {
        claimedBy: nip05,
      },
    });

    if (!nonceUpdate) {
      throw new Error('Failed to update nonce');
    }

    return true;
  });
}

export { createNonce, claimNonce, updateNonce };
