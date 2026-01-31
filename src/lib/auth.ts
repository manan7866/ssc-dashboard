// lib/auth.ts
import { Session } from 'next-auth';

/**
 * Determines the appropriate redirect path based on user session and status
 */
export function getRedirectPath(session: Session | null): string {
  if (!session || !session.user) {
    return '/auth/login';
  }

  const user = session.user;

  // Check user status first
  switch (user.status) {
    case 'PENDING':
      return '/waiting';
    case 'REJECTED':
      // For rejected users, we might want to show an access denied page
      // or redirect to login depending on requirements
      return '/auth/login';
    case 'APPROVED':
      // User is approved, now check role for appropriate dashboard
      switch (user.role) {
        case 'ADMIN':
          // Admin users go to admin dashboard
          // Note: Admin users are authenticated differently (env-based)
          // This is for role-based routing after authentication
          return '/admin/dashboard';
        case 'GENERAL':
        case 'DONOR':
        case 'VOLUNTEER':
        case 'COLLABORATOR':
          // Regular users go to user dashboard
          return '/user/dashboard';
        default:
          // Default to user dashboard if role is unknown
          return '/user/dashboard';
      }
    default:
      // If status is unknown, redirect to login
      return '/auth/login';
  }
}

/**
 * Checks if user has the required role
 */
export function hasRole(session: Session | null, requiredRole: string): boolean {
  if (!session || !session.user) {
    return false;
  }

  return session.user.role === requiredRole;
}

/**
 * Checks if user has any of the required roles
 */
export function hasAnyRole(session: Session | null, requiredRoles: string[]): boolean {
  if (!session || !session.user) {
    return false;
  }

  return requiredRoles.includes(session.user.role);
}

/**
 * Checks if user is approved
 */
export function isApproved(session: Session | null): boolean {
  if (!session || !session.user) {
    return false;
  }

  return session.user.status === 'APPROVED';
}

/**
 * Checks if user is pending approval
 */
export function isPending(session: Session | null): boolean {
  if (!session || !session.user) {
    return false;
  }

  return session.user.status === 'PENDING';
}

/**
 * Checks if user is rejected
 */
export function isRejected(session: Session | null): boolean {
  if (!session || !session.user) {
    return false;
  }

  return session.user.status === 'REJECTED';
}

/**
 * Gets the appropriate dashboard path for the user
 */
export function getUserDashboardPath(session: Session | null): string {
  if (!isApproved(session)) {
    return '/waiting'; // Redirect pending/rejected users to waiting page
  }

  // Approved users go to their respective dashboards
  return hasAnyRole(session, ['ADMIN']) ? '/admin/dashboard' : '/user/dashboard';
}