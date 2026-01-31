// types/interview.ts
export interface Interview {
  id: string;
  userId?: string;
  requestDate: Date;
  preferredDate: Date;
  preferredTime: string;
  status: 'REQUESTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  scheduledDate?: Date;
  scheduledTime?: string;
  adminNotes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}