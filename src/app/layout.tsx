import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Claim Badge',
  description: 'Claim your badge',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-w-screen w-full min-h-screen h-full">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
