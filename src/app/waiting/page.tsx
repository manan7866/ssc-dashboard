'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WaitingPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds countdown

  useEffect(() => {
    // Check if user is still pending or has been approved/rejected
    if (status === 'authenticated' && session?.user) {
      if (session.user.status === 'APPROVED') {
        router.push('/dashboard');
      } else if (session.user.status === 'REJECTED') {
        router.push('/'); // Redirect to home or show rejection message
      }
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Refresh session to check for approval
          update();
          return 30; // Reset timer
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session, status, router, update]);

  const handleRefresh = async () => {
    await update(); // Refresh session
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Account Pending Approval</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-4">
            Thank you for registering! Your account is currently pending admin approval.
          </p>

          <p className="mb-6">
            You will be redirected to the dashboard automatically once approved.
          </p>

          <div className="mb-6">
            <p>Checking for approval in: <span className="font-bold">{timeLeft}s</span></p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleRefresh}
              className="w-full"
            >
              Refresh Status
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}