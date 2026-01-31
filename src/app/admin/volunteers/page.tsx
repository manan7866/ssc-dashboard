'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { columns } from '@/components/admin/volunteers-columns';
import { Volunteer } from '@/types/volunteer';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch volunteers from API
    const fetchVolunteers = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');

        if (!adminToken) {
          console.error('No admin token found');
          return;
        }

        const response = await fetch('/api/admin/volunteers', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setVolunteers(result.data || []);
        } else {
          console.error('Failed to fetch volunteers:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  const handleApproveVolunteer = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/volunteers/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh volunteers list
        const updatedResponse = await fetch('/api/admin/volunteers', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setVolunteers(result.data || []);
        }
      } else {
        console.error('Failed to approve volunteer:', response.statusText);
      }
    } catch (error) {
      console.error('Error approving volunteer:', error);
    }
  };

  const handleDisapproveVolunteer = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/volunteers/${id}/disapprove`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Not approved' }),
      });

      if (response.ok) {
        // Refresh volunteers list
        const updatedResponse = await fetch('/api/admin/volunteers', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setVolunteers(result.data || []);
        }
      } else {
        console.error('Failed to disapprove volunteer:', response.statusText);
      }
    } catch (error) {
      console.error('Error disapproving volunteer:', error);
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
        <h1 className="text-3xl font-bold">Volunteers Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Create New</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Volunteers Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Volunteers</h3>
              <p className="text-2xl font-bold">{volunteers.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Approved</h3>
              <p className="text-2xl font-bold">
                {volunteers.filter(v => v.approvalStatus === 'APPROVED').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Pending</h3>
              <p className="text-2xl font-bold">
                {volunteers.filter(v => v.approvalStatus === 'PENDING').length}
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={volunteers}
            actions={(row) => (
              <div className="flex space-x-2">
                {row.approvalStatus !== 'APPROVED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApproveVolunteer(row.id)}
                  >
                    Approve
                  </Button>
                )}
                {row.approvalStatus !== 'DISAPPROVED' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDisapproveVolunteer(row.id)}
                  >
                    Disapprove
                  </Button>
                )}
              </div>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}