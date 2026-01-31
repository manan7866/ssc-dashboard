'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function UserVolunteers() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [volunteerInfo, setVolunteerInfo] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>([]);
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

      // Fetch user volunteer info and opportunities
      fetchVolunteerData();
    }
  }, [status, session, router]);

  const fetchVolunteerData = async () => {
    try {
      // Fetch user's volunteer application
      const volunteerResponse = await fetch('/api/user/volunteer', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      // Handle non-JSON responses safely
      const contentType = volunteerResponse.headers.get('content-type');
      let volunteerResult;

      if (contentType && contentType.includes('application/json')) {
        volunteerResult = await volunteerResponse.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await volunteerResponse.text();
        console.error('Non-JSON response from volunteer API:', text);
        volunteerResult = { success: false, message: 'Server error: Invalid response format', data: null };
      }

      if (volunteerResponse.ok && volunteerResult.success) {
        setVolunteerInfo(volunteerResult.data);
      }

      // Fetch volunteer opportunities
      const opportunitiesResponse = await fetch('/api/user/volunteer/opportunities', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      // Handle non-JSON responses safely
      const oppContentType = opportunitiesResponse.headers.get('content-type');
      let opportunitiesResult;

      if (oppContentType && oppContentType.includes('application/json')) {
        opportunitiesResult = await opportunitiesResponse.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await opportunitiesResponse.text();
        console.error('Non-JSON response from volunteer opportunities API:', text);
        opportunitiesResult = { success: false, message: 'Server error: Invalid response format', data: [] };
      }

      if (opportunitiesResponse.ok && opportunitiesResult.success) {
        setOpportunities(opportunitiesResult.data || []);
      }
    } catch (error) {
      setError('An error occurred while fetching volunteer data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    // This would typically open a form to apply for volunteering
    router.push('/user/volunteers/apply');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Loading Volunteer Information...</h1>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Volunteer Program</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Volunteer Status */}
        <Card>
          <CardHeader>
            <CardTitle>Your Volunteer Status</CardTitle>
          </CardHeader>
          <CardContent>
            {volunteerInfo ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{volunteerInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{volunteerInfo.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Areas of Support:</span>
                  <span>{Array.isArray(volunteerInfo.areasOfSupport) ? volunteerInfo.areasOfSupport.join(', ') : volunteerInfo.areasOfSupport}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <Badge variant={
                    volunteerInfo.approvalStatus === 'APPROVED' ? 'default' :
                    volunteerInfo.approvalStatus === 'PENDING' ? 'secondary' :
                    'destructive'
                  }>
                    {volunteerInfo.approvalStatus}
                  </Badge>
                </div>
                {volunteerInfo.approvalDate && (
                  <div className="flex justify-between">
                    <span className="font-medium">Approved Date:</span>
                    <span>{new Date(volunteerInfo.approvalDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p className="mb-4">You haven't applied to be a volunteer yet.</p>
                <Button onClick={handleApply}>
                  Apply to Volunteer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Volunteer Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Available Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {opportunities.length > 0 ? (
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border p-4 rounded-lg">
                    <h3 className="font-semibold">{opportunity.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline">{opportunity.category}</Badge>
                      <Button size="sm" variant="outline">Learn More</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No volunteer opportunities available at the moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}