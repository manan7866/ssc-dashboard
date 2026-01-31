// components/admin/collaborations-columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Collaboration } from '@/types/collaboration';

export const columns: ColumnDef<Collaboration>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'collaborationIntent',
    header: 'Intent',
  },
  {
    accessorKey: 'approvalStatus',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.approvalStatus;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

      switch (status) {
        case 'APPROVED':
          variant = 'default';
          break;
        case 'PENDING':
          variant = 'outline';
          break;
        case 'REJECTED':
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
    accessorKey: 'createdAt',
    header: 'Date Requested',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];