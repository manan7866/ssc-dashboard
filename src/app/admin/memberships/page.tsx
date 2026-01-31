'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { columns } from '@/components/admin/memberships-columns';
import { Membership } from '@/types/membership';

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch memberships from API
    const fetchMemberships = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');

        if (!adminToken) {
          console.error('No admin token found');
          return;
        }

        const response = await fetch('/api/admin/memberships', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setMemberships(result.data || []);
        } else {
          console.error('Failed to fetch memberships:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching memberships:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const handleApproveMembership = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/memberships/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh memberships list
        const updatedResponse = await fetch('/api/admin/memberships', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setMemberships(result.data || []);
        }
      } else {
        console.error('Failed to approve membership:', response.statusText);
      }
    } catch (error) {
      console.error('Error approving membership:', error);
    }
  };

  const handleRejectMembership = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/memberships/${id}/disapprove`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Not approved' }),
      });

      if (response.ok) {
        // Refresh memberships list
        const updatedResponse = await fetch('/api/admin/memberships', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setMemberships(result.data || []);
        }
      } else {
        console.error('Failed to reject membership:', response.statusText);
      }
    } catch (error) {
      console.error('Error rejecting membership:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Memberships Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Create New</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Memberships Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Memberships</h3>
              <p className="text-2xl font-bold">{memberships.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Paid</h3>
              <p className="text-2xl font-bold">
                {memberships.filter(m => m.paymentStatus === 'PAID').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Pending</h3>
              <p className="text-2xl font-bold">
                {memberships.filter(m => m.paymentStatus === 'PENDING').length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="text-2xl font-bold">
                {memberships.filter(m => m.paymentStatus === 'NOT_REQUIRED').length}
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={memberships}
            actions={(row) => (
              <div className="flex space-x-2">
                {row.paymentStatus === 'PENDING' && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproveMembership(row.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectMembership(row.id)}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}