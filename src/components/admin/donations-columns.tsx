// components/admin/donations-columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Donation } from '@/types/donation';

export const columns: ColumnDef<Donation>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'donationType',
    header: 'Type',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `₹${row.original.amount}`,
  },
  {
    accessorKey: 'razorpayOrderId',
    header: 'Order ID',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

      switch (status) {
        case 'VERIFIED':
          variant = 'default';
          break;
        case 'PAID':
          variant = 'secondary';
          break;
        case 'CREATED':
          variant = 'outline';
          break;
        case 'REFUNDED':
          variant = 'destructive';
          break;
        default:
          variant = 'default';
      }

      return (
        <Badge variant={variant}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'donationDate',
    header: 'Date',
    cell: ({ row }) => new Date(row.original.donationDate).toLocaleDateString(),
  },
];