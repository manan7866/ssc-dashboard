// types/donation.ts
export interface Donation {
  id: string;
  userId?: string;
  name: string;
  email: string;
  address: string;
  donationType: string;
  amount: number;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  paymentSignature?: string;
  status: 'CREATED' | 'PAID' | 'VERIFIED' | 'REFUNDED';
  donationDate: Date;
  refundedAt?: Date;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}