'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { columns } from '@/components/admin/interviews-columns';
import { Interview } from '@/types/interview';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch interviews from API
    const fetchInterviews = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');

        if (!adminToken) {
          console.error('No admin token found');
          return;
        }

        const response = await fetch('/api/admin/interviews', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setInterviews(result.data || []);
        } else {
          console.error('Failed to fetch interviews:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleScheduleInterview = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      // Mock schedule data - in a real app, you'd have a form to collect this
      const scheduleData = {
        scheduledDate: new Date().toISOString(),
        scheduledTime: '10:00 AM'
      };

      const response = await fetch(`/api/admin/interviews/${id}/schedule`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData),
      });

      if (response.ok) {
        // Refresh interviews list
        const updatedResponse = await fetch('/api/admin/interviews', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setInterviews(result.data || []);
        }
      } else {
        console.error('Failed to schedule interview:', response.statusText);
      }
    } catch (error) {
      console.error('Error scheduling interview:', error);
    }
  };

  const handleCompleteInterview = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/interviews/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh interviews list
        const updatedResponse = await fetch('/api/admin/interviews', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setInterviews(result.data || []);
        }
      } else {
        console.error('Failed to complete interview:', response.statusText);
      }
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  const handleCancelInterview = async (id: string) => {
    // Note: The backend doesn't have a cancel endpoint, so we'll just show a message
    alert('Cancel functionality not implemented in the backend yet.');
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
        <h1 className="text-3xl font-bold">Inspiration Interviews Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Schedule Bulk</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interviews Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Requests</h3>
              <p className="text-2xl font-bold">{interviews.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Scheduled</h3>
              <p className="text-2xl font-bold">
                {interviews.filter(i => i.status === 'SCHEDULED').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Completed</h3>
              <p className="text-2xl font-bold">
                {interviews.filter(i => i.status === 'COMPLETED').length}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Cancelled</h3>
              <p className="text-2xl font-bold">
                {interviews.filter(i => i.status === 'CANCELLED').length}
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={interviews}
            actions={(row) => (
              <div className="flex space-x-2">
                {row.status === 'REQUESTED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleScheduleInterview(row.id)}
                  >
                    Schedule
                  </Button>
                )}
                {row.status === 'SCHEDULED' && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => handleCompleteInterview(row.id)}
                  >
                    Complete
                  </Button>
                )}
                {(row.status === 'REQUESTED' || row.status === 'SCHEDULED') && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleCancelInterview(row.id)}
                  >
                    Cancel
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