// components/admin/memberships-columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Membership } from '@/types/membership';

export const columns: ColumnDef<Membership>[] = [
  {
    accessorKey: 'membershipType',
    header: 'Type',
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
  },
  {
    accessorKey: 'paymentRequired',
    header: 'Payment Required',
    cell: ({ row }) => row.original.paymentRequired ? 'Yes' : 'No',
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => {
      const status = row.original.paymentStatus;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

      switch (status) {
        case 'PAID':
          variant = 'default';
          break;
        case 'PENDING':
          variant = 'secondary';
          break;
        case 'NOT_REQUIRED':
          variant = 'outline';
          break;
        case 'FAILED':
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
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : 'N/A',
  },
  {
    accessorKey: 'endDate',
    header: 'End Date',
    cell: ({ row }) => row.original.endDate ? new Date(row.original.endDate).toLocaleDateString() : 'N/A',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date Created',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];