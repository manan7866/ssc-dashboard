'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserSidebar } from '@/components/user/sidebar';
import { getRedirectPath } from '@/lib/auth';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    // Check if user is an admin - if so, redirect to admin dashboard
    if (session?.user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
      return;
    }

    // Use the auth utility to determine the correct redirect path
    const redirectPath = getRedirectPath(session);

    // If the user doesn't have access to the user dashboard, redirect them
    if (redirectPath !== '/user/dashboard' && redirectPath !== '/waiting') {
      router.push(redirectPath);
      return;
    }

    // Check if user is approved to access user dashboard
    if (session?.user) {
      const userStatus = session.user.status;
      if (userStatus === 'PENDING') {
        router.push('/waiting');
        return;
      }
      if (userStatus === 'REJECTED') {
        // Show access denied page or redirect to login
        router.push('/auth/login');
        return;
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will be redirected by useEffect
  }

  return (
    <div className="flex h-screen bg-background">
      <UserSidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}