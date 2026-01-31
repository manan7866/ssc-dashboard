'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/toaster';

type Props = {
  children?: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
}