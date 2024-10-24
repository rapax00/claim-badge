import { randomBytes } from 'crypto';
import { prisma } from './prismaClient';

async function createNonce(definitionId: string): Promise<string> {
  const nonce = await prisma.nonce.create({
    data: { value: randomBytes(32).toString('hex'), definitionId },
  });

  return nonce.value;
}

async function claimNonce(value: string, nip05: string): Promise<boolean> {
  return await prisma.$transaction(async (tx) => {
    const nonce = await tx.nonce.findUnique({ where: { value } });
    if (!nonce) {
      throw new Error('Nonce not found');
    }

    const currentTime = new Date();
    const creationTime = nonce.createdAt;
    const timeDifference =
      (currentTime.getTime() - creationTime.getTime()) / 1000; // Convert to seconds

    if (timeDifference > 10) {
      return false;
    }

    const nonceUpdate = await tx.nonce.update({
      where: { value },
      data: { claimedBy: nip05, usedAt: currentTime },
    });

    if (!nonceUpdate) {
      throw new Error('Failed to claim nonce');
    }

    return true;
  });
}

export { createNonce, claimNonce };
