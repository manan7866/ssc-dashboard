'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [userType, setUserType] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    if (session) {
      // Determine user type based on session
      if (session.user?.role === 'ADMIN') {
        setUserType('admin');
      } else {
        setUserType('user');
      }
    }
  }, [session]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to SSC Dual Dashboards</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            This platform provides separate dashboards for administrators and users to manage conference operations.
          </p>

          {!session ? (
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/auth/login')}
                className="w-full"
              >
                Login
              </Button>
              <Button
                onClick={() => router.push('/auth/register')}
                variant="outline"
                className="w-full"
              >
                Register
              </Button>
            </div>
          ) : userType === 'admin' ? (
            <div className="space-y-4">
              <p>You are logged in as an administrator.</p>
              <Button
                onClick={() => handleNavigation('/admin/dashboard')}
                className="w-full"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p>You are logged in as a user.</p>
              <Button
                onClick={() => handleNavigation('/user/dashboard')}
                className="w-full"
              >
                Go to User Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}