'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function UserCollaborations() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [collaborationInfo, setCollaborationInfo] = useState<any>(null);
  const [partnerships, setPartnerships] = useState<any[]>([]);
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

      // Fetch user collaboration info and partnerships
      fetchCollaborationData();
    }
  }, [status, session, router]);

  const fetchCollaborationData = async () => {
    try {
      // Fetch user's collaboration application
      const collaborationResponse = await fetch('/api/user/collaboration', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      // Handle non-JSON responses safely
      const contentType = collaborationResponse.headers.get('content-type');
      let collaborationResult;

      if (contentType && contentType.includes('application/json')) {
        collaborationResult = await collaborationResponse.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await collaborationResponse.text();
        console.error('Non-JSON response from collaboration API:', text);
        collaborationResult = { success: false, message: 'Server error: Invalid response format', data: null };
      }

      if (collaborationResponse.ok && collaborationResult.success) {
        setCollaborationInfo(collaborationResult.data);
      }

      // Fetch collaboration opportunities
      const partnershipsResponse = await fetch('/api/user/collaboration/opportunities', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      // Handle non-JSON responses safely
      const oppContentType = partnershipsResponse.headers.get('content-type');
      let partnershipsResult;

      if (oppContentType && oppContentType.includes('application/json')) {
        partnershipsResult = await partnershipsResponse.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await partnershipsResponse.text();
        console.error('Non-JSON response from collaboration opportunities API:', text);
        partnershipsResult = { success: false, message: 'Server error: Invalid response format', data: [] };
      }

      if (partnershipsResponse.ok && partnershipsResult.success) {
        setPartnerships(partnershipsResult.data || []);
      }
    } catch (error) {
      setError('An error occurred while fetching collaboration data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    // This would typically open a form to apply for collaboration
    router.push('/user/collaborations/apply');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Loading Collaboration Information...</h1>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Collaboration Program</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Collaboration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Your Collaboration Status</CardTitle>
          </CardHeader>
          <CardContent>
            {collaborationInfo ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{collaborationInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{collaborationInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Phone:</span>
                  <span>{collaborationInfo.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Collaboration Intent:</span>
                  <span>{collaborationInfo.collaborationIntent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={
                    collaborationInfo.approvalStatus === 'APPROVED' ? 'default' :
                    collaborationInfo.approvalStatus === 'PENDING' ? 'secondary' :
                    'destructive'
                  }>
                    {collaborationInfo.approvalStatus}
                  </Badge>
                </div>
                {collaborationInfo.approvalDate && (
                  <div className="flex justify-between">
                    <span className="font-medium">Approved Date:</span>
                    <span>{new Date(collaborationInfo.approvalDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="mb-4">You haven't applied for collaboration yet.</p>
                <Button onClick={handleApply}>
                  Apply for Collaboration
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Partnership Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Partnership Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {partnerships.length > 0 ? (
              <div className="space-y-4">
                {partnerships.map((partnership) => (
                  <div key={partnership.id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">{partnership.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{partnership.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline">{partnership.type}</Badge>
                      <Button size="sm" variant="outline">Learn More</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No partnership opportunities available at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}