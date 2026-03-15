import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Dioscuri Brand Toolkit Suite',
  description: 'Shared platform for motion scenes, branded dataviz, and social publishing templates.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
