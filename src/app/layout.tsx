import type { Metadata } from 'next';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
