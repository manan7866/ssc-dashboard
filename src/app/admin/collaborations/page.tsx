'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { columns } from '@/components/admin/collaborations-columns';
import { Collaboration } from '@/types/collaboration';

export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch collaborations from API
    const fetchCollaborations = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');

        if (!adminToken) {
          console.error('No admin token found');
          return;
        }

        const response = await fetch('/api/admin/collaborations', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setCollaborations(result.data || []);
        } else {
          console.error('Failed to fetch collaborations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching collaborations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaborations();
  }, []);

  const handleApproveCollaboration = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/collaborations/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh collaborations list
        const updatedResponse = await fetch('/api/admin/collaborations', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setCollaborations(result.data || []);
        }
      } else {
        console.error('Failed to approve collaboration:', response.statusText);
      }
    } catch (error) {
      console.error('Error approving collaboration:', error);
    }
  };

  const handleRejectCollaboration = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/collaborations/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Not approved' }),
      });

      if (response.ok) {
        // Refresh collaborations list
        const updatedResponse = await fetch('/api/admin/collaborations', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setCollaborations(result.data || []);
        }
      } else {
        console.error('Failed to reject collaboration:', response.statusText);
      }
    } catch (error) {
      console.error('Error rejecting collaboration:', error);
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
        <h1 className="text-3xl font-bold">Collaborations Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Create New</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collaborations Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Requests</h3>
              <p className="text-2xl font-bold">{collaborations.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Approved</h3>
              <p className="text-2xl font-bold">
                {collaborations.filter(c => c.approvalStatus === 'APPROVED').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Pending</h3>
              <p className="text-2xl font-bold">
                {collaborations.filter(c => c.approvalStatus === 'PENDING').length}
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={collaborations}
            actions={(row) => (
              <div className="flex space-x-2">
                {row.approvalStatus !== 'APPROVED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApproveCollaboration(row.id)}
                  >
                    Approve
                  </Button>
                )}
                {row.approvalStatus !== 'REJECTED' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRejectCollaboration(row.id)}
                  >
                    Reject
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