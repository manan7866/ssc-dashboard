'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ApplyVolunteer() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    areasOfSupport: [] as string[],
    preferredMode: '',
    bookingSlots: {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Areas of support options
  const areasOfSupportOptions = [
    'Event Organization',
    'Registration Desk',
    'Technical Support',
    'Hospitality',
    'Marketing',
    'Social Media',
    'Documentation',
    'Photography/Videography'
  ];

  const handleAreaChange = (area: string) => {
    setFormData(prev => {
      const currentAreas = [...prev.areasOfSupport];
      if (currentAreas.includes(area)) {
        return {
          ...prev,
          areasOfSupport: currentAreas.filter(a => a !== area)
        };
      } else {
        return {
          ...prev,
          areasOfSupport: [...currentAreas, area]
        };
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.areasOfSupport.length === 0) {
      setError('Please select at least one area of support');
      setLoading(false);
      return;
    }

    try {
      // Prepare volunteer application data
      const volunteerData = {
        ...formData,
        userId: session?.user?.id, // Include user ID if available
        name: formData.name || session?.user?.name || '',
        email: formData.email || session?.user?.email || '',
        areasOfSupport: formData.areasOfSupport
      };

      const response = await fetch('/api/user/volunteers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(volunteerData),
      });

      // Handle non-JSON responses safely
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await response.text();
        console.error('Non-JSON response from volunteer API:', text);
        result = { success: false, message: 'Server error: Invalid response format' };
      }

      if (response.ok && result.success) {
        // Redirect to success page or volunteer dashboard
        router.push('/user/volunteers');
        alert('Volunteer application submitted successfully! Our team will review your application and get back to you soon.');
      } else {
        setError(result.message || 'Failed to submit volunteer application');
      }
    } catch (err) {
      setError('An error occurred while submitting volunteer application');
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
        <h1 className="text-3xl font-bold">Apply to Volunteer</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Volunteer Application</CardTitle>
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

            <div className="space-y-4">
              <Label>Areas of Support</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {areasOfSupportOptions.map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`area-${area}`}
                      checked={formData.areasOfSupport.includes(area)}
                      onChange={() => handleAreaChange(area)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor={`area-${area}`}>{area}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredMode">Preferred Mode of Volunteering</Label>
              <Input
                id="preferredMode"
                name="preferredMode"
                type="text"
                value={formData.preferredMode}
                onChange={handleChange}
                placeholder="e.g., In-person, Remote, Hybrid"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bookingSlots">Available Time Slots</Label>
              <Textarea
                id="bookingSlots"
                name="bookingSlots"
                value={typeof formData.bookingSlots === 'string' ? formData.bookingSlots : JSON.stringify(formData.bookingSlots)}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  bookingSlots: e.target.value
                }))}
                placeholder="Describe your available time slots for volunteering..."
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