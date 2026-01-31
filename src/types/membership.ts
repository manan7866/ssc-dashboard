// types/membership.ts
export interface Membership {
  id: string;
  userId?: string;
  membershipType: 'GENERAL' | 'DONOR' | 'VOLUNTEER' | 'COLLABORATOR';
  paymentRequired: boolean;
  paymentStatus: 'NOT_REQUIRED' | 'PENDING' | 'PAID' | 'FAILED';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}