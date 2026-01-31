import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Check for admin token in Authorization header
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Forward the request to the backend
    const BACKEND_URL = process.env.BACKEND_URL || 'https://abdulmanan04-ssc-dashboards.hf.space';

    const response = await fetch(`${BACKEND_URL}/api/admin/dashboard`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}