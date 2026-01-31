'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { columns } from '@/components/user/donations-columns';

export default function UserDonations() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (status === 'authenticated' && session?.user) {
      // Check if user is approved
      if (session.user.status !== 'APPROVED') {
        router.push('/waiting');
        return;
      }

      // Fetch user donations
      fetchUserDonations();
    }
  }, [status, session, router]);

  const fetchUserDonations = async () => {
    try {
      const response = await fetch('/api/user/donations', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      // Handle non-JSON responses safely
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await response.text();
        console.error('Non-JSON response from donations API:', text);
        result = { success: false, message: 'Server error: Invalid response format', data: [] };
      }

      if (response.ok && result.success) {
        setDonations(result.data || []);
      } else {
        console.error('Failed to fetch donations');
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewDonation = () => {
    router.push('/user/donations/new');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Loading Donations...</h1>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Donations</h1>
        <Button onClick={handleNewDonation}>
          Make New Donation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation History</CardTitle>
        </CardHeader>
        <CardContent>
          {donations.length > 0 ? (
            <DataTable
              columns={columns}
              data={donations}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">You haven't made any donations yet.</p>
              <Button
                className="mt-4"
                onClick={handleNewDonation}
              >
                Make Your First Donation
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}