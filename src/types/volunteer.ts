// types/volunteer.ts
export interface Volunteer {
  id: string;
  userId?: string;
  name: string;
  email: string;
  address: string;
  areasOfSupport: string[];
  preferredMode: string;
  bookingSlots: any; // Could be more specific based on actual data structure
  approvalStatus: 'PENDING' | 'APPROVED' | 'DISAPPROVED';
  approvalDate?: Date;
  disapprovalReason?: string;
  createdAt: Date;
  updatedAt: Date;
}