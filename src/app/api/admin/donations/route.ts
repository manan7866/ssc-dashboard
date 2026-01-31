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
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const status = searchParams.get('status');

    let backendUrl = `${BACKEND_URL}/api/admin/donations?page=${page}&limit=${limit}`;
    if (status) {
      backendUrl += `&status=${status}`;
    }

    const response = await fetch(backendUrl, {
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

export async function PUT(request: NextRequest) {
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
    // Extract donationId from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const donationId = pathParts[pathParts.length - 1];

    // Check if this is a verify request
    const isVerify = url.pathname.includes('/verify');

    // Forward the request to the backend
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4001';
    const backendUrl = isVerify
      ? `${BACKEND_URL}/api/admin/donations/${donationId}/verify`
      : `${BACKEND_URL}/api/admin/donations/${donationId}/refund`;

    // Get the request body for refund
    const body = await request.json();
    const reason = body.reason || '';

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(isVerify ? {} : { reason }),
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