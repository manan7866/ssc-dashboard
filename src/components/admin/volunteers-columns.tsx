// components/admin/volunteers-columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Volunteer } from '@/types/volunteer';

export const columns: ColumnDef<Volunteer>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'areasOfSupport',
    header: 'Areas of Support',
    cell: ({ row }) => row.original.areasOfSupport.join(', '),
  },
  {
    accessorKey: 'preferredMode',
    header: 'Preferred Mode',
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
        case 'DISAPPROVED':
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
    header: 'Date Applied',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];