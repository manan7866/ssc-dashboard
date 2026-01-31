'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
      router.push('/auth/login');
      return;
    }

    // Load dashboard stats
    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        setError('Admin token not found. Please log in again.');
        return;
      }

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
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
        console.error('Non-JSON response from admin dashboard API:', text);
        result = { success: false, message: 'Server error: Invalid response format', data: null };
      }

      if (response.ok && result.success) {
        setStats(result.data);
      } else {
        // Check if it's a token-related error
        if (result.message && (result.message.includes('Invalid') || result.message.includes('expired'))) {
          setError('Invalid or expired token. Please log in again.');
          // Optionally, redirect to login
          setTimeout(() => {
            localStorage.removeItem('adminToken');
            router.push('/auth/login');
          }, 2000);
        } else {
          setError(result.message || 'Failed to load dashboard stats');
        }
      }
    } catch (err) {
      setError('An error occurred while fetching dashboard stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
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
            <Button onClick={fetchDashboardStats} className="mt-4">
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-500">{stats?.pendingApprovals || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalDonations || 0}</p>
            <p className="text-lg">₹{stats?.donationAmount?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg"><span className="font-semibold">Volunteers:</span> {stats?.pendingVolunteers || 0}</p>
            <p className="text-lg"><span className="font-semibold">Collaborations:</span> {stats?.pendingCollaborations || 0}</p>
            <p className="text-lg"><span className="font-semibold">Interviews:</span> {stats?.pendingInterviews || 0}</p>
            <p className="text-lg"><span className="font-semibold">Memberships:</span> {stats?.pendingMemberships || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full"
              onClick={() => router.push('/admin/donations')}
            >
              Manage Donations
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push('/admin/volunteers')}
            >
              Review Volunteers
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push('/admin/collaborations')}
            >
              Review Collaborations
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push('/admin/interviews')}
            >
              Review Interviews
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push('/admin/memberships')}
            >
              Review Memberships
            </Button>
            <Button
              className="w-full"
              onClick={() => router.push('/admin/conferences')}
            >
              Manage Conferences
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>New donation received</span>
                <span className="text-sm text-gray-500">2 min ago</span>
              </li>
              <li className="flex justify-between">
                <span>Volunteer approved</span>
                <span className="text-sm text-gray-500">15 min ago</span>
              </li>
              <li className="flex justify-between">
                <span>New collaboration request</span>
                <span className="text-sm text-gray-500">1 hour ago</span>
              </li>
              <li className="flex justify-between">
                <span>User registered</span>
                <span className="text-sm text-gray-500">3 hours ago</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}