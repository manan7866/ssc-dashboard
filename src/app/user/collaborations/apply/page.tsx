'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ApplyCollaboration() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    collaborationIntent: '',
    organization: '',
    collaborationType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      collaborationType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare collaboration application data
      const collaborationData = {
        ...formData,
        userId: session?.user?.id, // Include user ID if available
        name: formData.name || session?.user?.name || '',
        email: formData.email || session?.user?.email || '',
        organization: formData.organization || session?.user?.organization || ''
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/collaborations/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(collaborationData),
      });

      // Handle non-JSON responses safely
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await response.text();
        console.error('Non-JSON response from collaboration API:', text);
        result = { success: false, message: 'Server error: Invalid response format' };
      }

      if (response.ok && result.success) {
        // Redirect to success page or collaboration dashboard
        router.push('/user/collaborations');
        alert('Collaboration application submitted successfully! Our team will review your application and get back to you soon.');
      } else {
        setError(result.message || 'Failed to submit collaboration application');
      }
    } catch (err) {
      setError('An error occurred while submitting collaboration application');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Loading...</h1>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Apply for Collaboration</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collaboration Application</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name || session?.user?.name || ''}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || session?.user?.email || ''}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  name="organization"
                  type="text"
                  value={formData.organization || session?.user?.organization || ''}
                  onChange={handleChange}
                  placeholder="Enter your organization name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="collaborationType">Type of Collaboration</Label>
              <Select value={formData.collaborationType} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select collaboration type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic Partnership</SelectItem>
                  <SelectItem value="industry">Industry Collaboration</SelectItem>
                  <SelectItem value="research">Research Collaboration</SelectItem>
                  <SelectItem value="sponsorship">Sponsorship</SelectItem>
                  <SelectItem value="event">Event Collaboration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collaborationIntent">Collaboration Intent</Label>
              <Textarea
                id="collaborationIntent"
                name="collaborationIntent"
                value={formData.collaborationIntent}
                onChange={handleChange}
                placeholder="Describe your collaboration intent and how you'd like to collaborate with us..."
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}