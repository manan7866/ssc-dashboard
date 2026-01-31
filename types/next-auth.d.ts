import { DefaultSession } from 'next-auth';

// Define role and status types
type UserRole = 'ADMIN' | 'GENERAL' | 'DONOR' | 'VOLUNTEER' | 'COLLABORATOR';
type UserStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string;
      name?: string;
      email?: string;
      role?: UserRole;
      status?: UserStatus;
      address?: string;
      phone?: string;
      organization?: string;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    address: string;
    phone: string;
    organization: string;
    token: string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
    address?: string;
    phone?: string;
    organization?: string;
    jwt?: string;
  }
}