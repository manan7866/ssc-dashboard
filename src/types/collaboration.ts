// types/collaboration.ts
export interface Collaboration {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  collaborationIntent: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}