'use client';

import { ClaimForm } from '@/components/ClaimForm';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ClaimForm />
      </div>
    </Suspense>
  );
}
