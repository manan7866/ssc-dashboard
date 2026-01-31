'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/admin/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated as admin
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
      router.push('/auth/login');
      return;
    }

    // Optionally, verify admin token validity
    // This could involve a fetch call to verify the token
  }, [router]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}