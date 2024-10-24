'use client';

import { useSearchParams } from 'next/navigation';
import { ClaimForm } from '@/components/ClaimForm';

export default function Page() {
  const searchParams = useSearchParams();
  const definitionId = searchParams.get('definitionid');
  const nonce = searchParams.get('nonce');

  if (!definitionId || !nonce) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Error: Missing definition ID or nonce.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ClaimForm definitionId={definitionId} nonce={nonce} />
    </div>
  );
}
