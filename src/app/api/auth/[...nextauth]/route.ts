import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define the NextAuth configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call the backend login API
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          // Handle non-JSON responses safely
          const contentType = response.headers.get('content-type');
          let data;

          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
          } else {
            // If not JSON, try to get text and return null
            const text = await response.text();
            console.error('Non-JSON response from auth API:', text);
            return null;
          }

          if (response.ok && data.user && data.token) {
            // Return user object with additional properties and the JWT token
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              role: data.user.role,
              status: data.user.status,
              image: data.user.image || undefined,
              address: data.user.address,
              phone: data.user.phone,
              organization: data.user.organization,
              token: data.token,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add custom properties to the token when user signs in
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.status = user.status;
        token.address = user.address;
        token.phone = user.phone;
        token.organization = user.organization;
        token.jwt = (user as any).token; // Access the custom token property
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom properties to the session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as 'ADMIN' | 'GENERAL' | 'DONOR' | 'VOLUNTEER' | 'COLLABORATOR' | undefined;
        session.user.status = token.status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined;
        session.user.address = token.address as string;
        session.user.phone = token.phone as string;
        session.user.organization = token.organization as string;
      }

      // Add the JWT token to the session so it can be used for API calls
      session.accessToken = token.jwt as string;

      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };