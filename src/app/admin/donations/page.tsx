'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/admin/data-table';
import { columns } from '@/components/admin/donations-columns';
import { Donation } from '@/types/donation';

export default function DonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch donations from API
    const fetchDonations = async () => {
      try {
        const adminToken = localStorage.getItem('adminToken');

        if (!adminToken) {
          console.error('No admin token found');
          return;
        }

        const response = await fetch('/api/admin/donations', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          setDonations(result.data || []);
        } else {
          console.error('Failed to fetch donations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handleVerifyDonation = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/donations/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh donations list
        const updatedResponse = await fetch('/api/admin/donations', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setDonations(result.data || []);
        }
      } else {
        console.error('Failed to verify donation:', response.statusText);
      }
    } catch (error) {
      console.error('Error verifying donation:', error);
    }
  };

  const handleRefundDonation = async (id: string) => {
    try {
      const adminToken = localStorage.getItem('adminToken');

      if (!adminToken) {
        console.error('No admin token found');
        return;
      }

      const response = await fetch(`/api/admin/donations/${id}/refund`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Refund requested' }),
      });

      if (response.ok) {
        // Refresh donations list
        const updatedResponse = await fetch('/api/admin/donations', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
          },
        });

        if (updatedResponse.ok) {
          const result = await updatedResponse.json();
          setDonations(result.data || []);
        }
      } else {
        console.error('Failed to refund donation:', response.statusText);
      }
    } catch (error) {
      console.error('Error refunding donation:', error);
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
        <h1 className="text-3xl font-bold">Donations Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Export Data</Button>
          <Button>Create New</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donations Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Total Donations</h3>
              <p className="text-2xl font-bold">{donations.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Verified</h3>
              <p className="text-2xl font-bold">
                {donations.filter(d => d.status === 'VERIFIED').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Pending</h3>
              <p className="text-2xl font-bold">
                {donations.filter(d => d.status === 'CREATED' || d.status === 'PAID').length}
              </p>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={donations}
            actions={(row) => (
              <div className="flex space-x-2">
                {row.status !== 'VERIFIED' && row.status !== 'REFUNDED' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVerifyDonation(row.id)}
                  >
                    Verify
                  </Button>
                )}
                {row.status !== 'REFUNDED' && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRefundDonation(row.id)}
                  >
                    Refund
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