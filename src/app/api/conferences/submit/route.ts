import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Get Authorization header - Next.js App Router typically capitalizes header names
  const authHeader = req.headers.get('Authorization');

  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Use the token from Authorization header
    token = authHeader.substring(7);
  } else {
    // Fallback to NextAuth session
    const session = await getServerSession(authOptions);
    if (!session || !session.accessToken) {
      console.log('No valid session found for conference submission');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    token = session.accessToken;
  }

  if (!token) {
    console.log('No token available for conference submission');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Forward the request to the backend
  const BACKEND_URL = process.env.BACKEND_URL || 'https://abdulmanan04-ssc-dashboards.hf.space';
  const backendUrl = `${BACKEND_URL}/api/conferences/submit`;

  try {
    const body = await req.json();

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}