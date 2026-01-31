import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id: string;
      /** The user's role */
      role: 'ADMIN' | 'GENERAL' | 'DONOR' | 'VOLUNTEER' | 'COLLABORATOR';
      /** The user's approval status */
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      /** The user's name */
      name?: string;
      /** The user's email */
      email?: string;
      /** The user's image */
      image?: string;
      /** The user's address */
      address?: string;
      /** The user's phone number */
      phone?: string;
      /** The user's organization (for collaborators) */
      organization?: string;
    } & DefaultSession['user'];
  }

  /** Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context */
  interface User {
    /** The user's id */
    id: string;
    /** The user's role */
    role: 'ADMIN' | 'GENERAL' | 'DONOR' | 'VOLUNTEER' | 'COLLABORATOR';
    /** The user's approval status */
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    /** The user's name */
    name?: string;
    /** The user's email */
    email?: string;
    /** The user's image */
    image?: string;
    /** The user's address */
    address?: string;
    /** The user's phone number */
    phone?: string;
    /** The user's organization (for collaborators) */
    organization?: string;
  }
}