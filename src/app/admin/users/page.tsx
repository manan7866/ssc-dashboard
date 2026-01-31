'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
      router.push('/auth/login');
      return;
    }

    // Fetch users
    fetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
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
        console.error('Non-JSON response from admin users API:', text);
        result = { success: false, message: 'Server error: Invalid response format', data: [] };
      }

      if (response.ok && result.success) {
        setUsers(result.data || []);
      } else {
        console.error('Failed to fetch users:', result.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
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
        console.error('Non-JSON response from admin users API:', text);
        result = { success: false, message: 'Server error: Invalid response format' };
      }

      if (response.ok && result.success) {
        // Refresh the user list
        fetchUsers();
      } else {
        console.error('Failed to approve user:', result.message);
      }
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleRejectUser = async (userId: string, reason: string = '') => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ reason }),
      });

      // Handle non-JSON responses safely
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await response.text();
        console.error('Non-JSON response from admin users API:', text);
        result = { success: false, message: 'Server error: Invalid response format' };
      }

      if (response.ok && result.success) {
        // Refresh the user list
        fetchUsers();
      } else {
        console.error('Failed to reject user:', result.message);
      }
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <Button onClick={() => fetchUsers()}>
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          user.role === 'ADMIN' ? 'default' :
                          user.role === 'GENERAL' ? 'secondary' :
                          user.role === 'DONOR' ? 'outline' :
                          user.role === 'VOLUNTEER' ? 'destructive' :
                          'secondary'
                        }>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          user.status === 'APPROVED' ? 'default' :
                          user.status === 'PENDING' ? 'secondary' :
                          'destructive'
                        }>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user.status === 'PENDING' && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveUser(user.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRejectUser(user.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No users found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}