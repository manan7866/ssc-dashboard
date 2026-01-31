'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export default function UserInterviews() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
  });

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

      // Fetch user interviews
      fetchInterviews();
    }
  }, [status, session, router]);

  const fetchInterviews = async () => {
    try {
      const response = await fetch('/api/user/interviews', {
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
        console.error('Non-JSON response from interviews API:', text);
        result = { success: false, message: 'Server error: Invalid response format', data: [] };
      }

      if (response.ok && result.success) {
        setInterviews(result.data || []);
      } else {
        console.error('Failed to fetch interviews:', result.message);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/user/interviews/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      // Handle non-JSON responses safely
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await response.text();
        console.error('Non-JSON response from interviews API:', text);
        result = { success: false, message: 'Server error: Invalid response format' };
      }

      if (response.ok && result.success) {
        // Reset form and refresh interviews
        setFormData({ preferredDate: '', preferredTime: '' });
        fetchInterviews();
        alert('Interview request submitted successfully!');
      } else {
        setError(result.message || 'Failed to submit interview request');
      }
    } catch (err) {
      setError('An error occurred while submitting interview request');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Loading Interviews...</h1>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Interviews</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle>Request an Interview</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input
                  id="preferredTime"
                  name="preferredTime"
                  type="time"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <Button type="submit" className="w-full">
                Request Interview
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Interviews */}
        <Card>
          <CardHeader>
            <CardTitle>My Interview Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {interviews.length > 0 ? (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <div key={interview.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Request Date: {new Date(interview.requestDate).toLocaleDateString()}</p>
                        <p>Preferred: {new Date(interview.preferredDate).toLocaleDateString()} at {interview.preferredTime}</p>
                        {interview.scheduledDate && (
                          <p>Scheduled: {new Date(interview.scheduledDate).toLocaleDateString()} at {interview.scheduledTime}</p>
                        )}
                      </div>
                      <Badge variant={
                        interview.status === 'REQUESTED' ? 'secondary' :
                        interview.status === 'SCHEDULED' ? 'default' :
                        interview.status === 'COMPLETED' ? 'outline' :
                        'destructive'
                      }>
                        {interview.status}
                      </Badge>
                    </div>
                    {interview.adminNotes && (
                      <p className="mt-2 text-sm text-gray-600">Admin Notes: {interview.adminNotes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No interview requests yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}