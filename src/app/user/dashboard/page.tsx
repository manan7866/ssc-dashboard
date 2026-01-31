'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      // Fetch dashboard data
      fetchDashboardData();
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/dashboard`, {
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
        console.error('Non-JSON response from dashboard API:', text);
        result = { success: false, message: 'Server error: Invalid response format', data: null };
      }

      if (response.ok && result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError('An error occurred while fetching dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <Badge variant="secondary">
          {dashboardData?.user?.role} • {dashboardData?.user?.status}
        </Badge>
      </div>

      {/* Personalized Welcome Message */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">
              Welcome back, {dashboardData?.user?.name || session?.user?.name || 'User'}!
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your {dashboardData?.user?.role.toLowerCase()} account.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Conference Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {dashboardData?.conference?.name}</p>
            <p><strong>Year:</strong> {dashboardData?.conference?.year}</p>
            <p><strong>Dates:</strong> {new Date(dashboardData?.conference?.startDate).toLocaleDateString()} - {new Date(dashboardData?.conference?.endDate).toLocaleDateString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Total Donations:</strong> {dashboardData?.overview?.donationStats?.totalDonations}</p>
            <p><strong>Total Amount:</strong> ₹{dashboardData?.overview?.donationStats?.totalAmount?.toFixed(2)}</p>
            <p><strong>Paid Donations:</strong> {dashboardData?.overview?.donationStats?.paidDonations}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interview Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Total Requests:</strong> {dashboardData?.overview?.interviewStats?.totalRequests}</p>
            <p><strong>Scheduled:</strong> {dashboardData?.overview?.interviewStats?.scheduled}</p>
            <p><strong>Completed:</strong> {dashboardData?.overview?.interviewStats?.completed}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.overview?.upcomingDeadlines?.length > 0 ? (
              <ul className="space-y-2">
                {dashboardData?.overview?.upcomingDeadlines.map((deadline: any, index: number) => (
                  <li key={index} className="flex justify-between">
                    <span>{deadline.title}</span>
                    <span>{new Date(deadline.date).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No upcoming deadlines</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membership</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.membership ? (
              <>
                <p><strong>Type:</strong> {dashboardData?.membership?.membershipType}</p>
                <p><strong>Status:</strong> {dashboardData?.membership?.paymentStatus}</p>
                <p><strong>Payment Required:</strong> {dashboardData?.membership?.paymentRequired ? 'Yes' : 'No'}</p>
              </>
            ) : (
              <p>No membership found. <Button variant="link" onClick={() => router.push('/user/membership')}>Request Membership</Button></p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role-specific Recommendations */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recommendations for you</CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData?.user?.role === 'DONOR' && (
              <div className="space-y-2">
                <p>You're a donor! Here are some ways to get more involved:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><Button variant="link" onClick={() => router.push('/user/donations')}>View your donation history</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/donations/new')}>Make a new donation</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/conferences')}>View and submit to conferences</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/interviews')}>Schedule an inspiration interview</Button></li>
                </ul>
              </div>
            )}

            {dashboardData?.user?.role === 'VOLUNTEER' && (
              <div className="space-y-2">
                <p>You're a volunteer! Here are opportunities for you:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><Button variant="link" onClick={() => router.push('/user/conferences')}>View and submit to conferences</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/membership')}>Upgrade your membership</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/interviews')}>Schedule an inspiration interview</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/profile')}>Update your profile</Button></li>
                </ul>
              </div>
            )}

            {dashboardData?.user?.role === 'COLLABORATOR' && (
              <div className="space-y-2">
                <p>You're a collaborator! Here are partnership opportunities:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><Button variant="link" onClick={() => router.push('/user/conferences')}>View and submit to conferences</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/membership')}>Manage your membership</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/interviews')}>Schedule an inspiration interview</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/profile')}>Update your profile</Button></li>
                </ul>
              </div>
            )}

            {(dashboardData?.user?.role === 'GENERAL' || !dashboardData?.user?.role) && (
              <div className="space-y-2">
                <p>Here are ways to get more involved:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><Button variant="link" onClick={() => router.push('/user/membership')}>Request a membership upgrade</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/conferences')}>View and submit to conferences</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/donations/new')}>Make a donation</Button></li>
                  <li><Button variant="link" onClick={() => router.push('/user/interviews')}>Schedule an inspiration interview</Button></li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}