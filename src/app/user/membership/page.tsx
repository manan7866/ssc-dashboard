'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UserMembership() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [membership, setMembership] = useState<any>(null);
  const [membershipType, setMembershipType] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

      // Fetch user membership
      fetchUserMembership();
    }
  }, [status, session, router]);

  const fetchUserMembership = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/membership`, {
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
        console.error('Non-JSON response from membership API:', text);
        result = { success: false, message: 'Server error: Invalid response format', data: null };
      }

      if (response.ok && result.success) {
        setMembership(result.data || null);
      } else {
        console.error('Failed to fetch membership');
      }
    } catch (error) {
      console.error('Error fetching membership:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/membership`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ membershipType }),
      });

      // Handle non-JSON responses safely
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await response.text();
        console.error('Non-JSON response from membership API:', text);
        result = { success: false, message: 'Server error: Invalid response format' };
      }

      if (response.ok && result.success) {
        setSuccess('Membership request submitted successfully!');
        // Refresh membership data
        fetchUserMembership();
      } else {
        setError(result.message || 'Failed to submit membership request');
      }
    } catch (err) {
      setError('An error occurred while submitting membership request');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Loading Membership...</h1>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Membership</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {membership ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="font-medium">{membership.membershipType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge variant={
                  membership.paymentStatus === 'PAID' ? 'default' :
                  membership.paymentStatus === 'PENDING' ? 'secondary' :
                  membership.paymentStatus === 'NOT_REQUIRED' ? 'outline' :
                  'destructive'
                }>
                  {membership.paymentStatus}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Required</p>
                <p className="font-medium">{membership.paymentRequired ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Joined Date</p>
                <p className="font-medium">{new Date(membership.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Request Membership</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="membershipType">Membership Type</Label>
                <Select value={membershipType} onValueChange={setMembershipType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select membership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GENERAL">General</SelectItem>
                    <SelectItem value="DONOR">Donor</SelectItem>
                    <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                    <SelectItem value="COLLABORATOR">Collaborator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4">
                <Button type="submit" disabled={submitting || !membershipType}>
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}