'use client';

import { InjectedNFCProvider } from '@/context/InjectedNFC';
import Login from '@/components/Login'; // Import the Login component
import { AuthProvider } from '@/context/Auth';

export default function Page() {
  return (
    <>
      <InjectedNFCProvider>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </InjectedNFCProvider>
    </>
  );
}
