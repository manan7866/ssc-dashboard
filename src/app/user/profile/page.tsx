'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner'; // We'll need to install this

export default function UserProfile() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

      // Load user data from backend API to ensure we have complete data
      const loadUserData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
            headers: {
              'Authorization': `Bearer ${session?.accessToken}`,
            },
          });

          const contentType = response.headers.get('content-type');
          let result;

          if (contentType && contentType.includes('application/json')) {
            result = await response.json();
          } else {
            const text = await response.text();
            console.error('Non-JSON response from profile API:', text);
            throw new Error('Server error: Invalid response format');
          }

          if (result.success && result.user) {
            setUserData({
              name: result.user.name || session.user.name || '',
              email: result.user.email || session.user.email || '',
              address: result.user.address || session.user.address || '',
              phone: result.user.phone || session.user.phone || ''
            });
          } else {
            // Fallback to session data if API call fails
            setUserData({
              name: session.user.name || '',
              email: session.user.email || '',
              address: session.user.address || '',
              phone: session.user.phone || ''
            });
          }
        } catch (err) {
          console.error('Error loading user profile:', err);
          // Fallback to session data if API call fails
          setUserData({
            name: session.user.name || '',
            email: session.user.email || '',
            address: session.user.address || '',
            phone: session.user.phone || ''
          });
        } finally {
          setLoading(false);
        }
      };

      loadUserData();
    } else if (status !== 'loading') {
      setLoading(false);
    }
  }, [status, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(userData),
      });

      // Handle non-JSON responses safely
      const contentType = response.headers.get('content-type');
      let result;

      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        // If not JSON, try to get text and create an error result
        const text = await response.text();
        console.error('Non-JSON response from profile API:', text);
        result = { success: false, message: 'Server error: Invalid response format' };
      }

      if (result.success) {
        toast.success('Profile updated successfully!');
        // Update session with new data
        await update();
      } else {
        setError(result.message || 'Failed to update profile');
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating profile');
      toast.error('An error occurred while updating profile');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold mb-6">Loading Profile...</h1>
          <div className="bg-gray-200 rounded-xl h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                value={userData.address}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={userData.phone}
                onChange={handleChange}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex space-x-4 pt-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}