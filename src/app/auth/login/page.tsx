'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isAdminLogin) {
        // Admin login - use the admin specific endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/admin/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.email, // Using email field for admin username
            password: formData.password
          }),
        });

        // Handle non-JSON responses safely
        const contentType = response.headers.get('content-type');
        let result;

        if (contentType && contentType.includes('application/json')) {
          result = await response.json();
        } else {
          // If not JSON, try to get text and create an error result
          const text = await response.text();
          console.error('Non-JSON response from admin auth API:', text);
          result = { success: false, message: 'Server error: Invalid response format' };
        }

        if (result.success) {
          // Store admin token and redirect
          localStorage.setItem('adminToken', result.token);
          router.push('/admin/dashboard');
        } else {
          setError(result.message || 'Invalid admin credentials');
        }
      } else {
        // Regular user login
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.ok) {
          router.push('/user/dashboard');
        } else {
          setError(result?.error || 'Invalid credentials');
        }
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex space-x-2 mb-4">
              <Button
                type="button"
                variant={!isAdminLogin ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => {
                  setIsAdminLogin(false);
                  setError('');
                }}
              >
                User
              </Button>
              <Button
                type="button"
                variant={isAdminLogin ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => {
                  setIsAdminLogin(true);
                  setError('');
                }}
              >
                Admin
              </Button>
            </div>

            {isAdminLogin ? (
              <div className="space-y-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Enter admin username"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>

            {!isAdminLogin && (
              <div className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <Link href="/auth/register" className="underline">
                  Register here
                </Link>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}