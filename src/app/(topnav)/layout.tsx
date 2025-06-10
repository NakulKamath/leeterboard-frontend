import React from 'react';
import Topnav from '@/components/Topnav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <>
          <Topnav />
          {children}
        </>
  );
}