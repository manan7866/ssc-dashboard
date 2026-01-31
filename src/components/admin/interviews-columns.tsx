// components/admin/interviews-columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Interview } from '@/types/interview';

export const columns: ColumnDef<Interview>[] = [
  {
    accessorKey: 'userId',
    header: 'User ID',
  },
  {
    accessorKey: 'requestDate',
    header: 'Request Date',
    cell: ({ row }) => new Date(row.original.requestDate).toLocaleDateString(),
  },
  {
    accessorKey: 'preferredDate',
    header: 'Preferred Date',
    cell: ({ row }) => new Date(row.original.preferredDate).toLocaleDateString(),
  },
  {
    accessorKey: 'preferredTime',
    header: 'Preferred Time',
  },
  {
    accessorKey: 'scheduledDate',
    header: 'Scheduled Date',
    cell: ({ row }) => row.original.scheduledDate ? new Date(row.original.scheduledDate).toLocaleDateString() : 'Not Scheduled',
  },
  {
    accessorKey: 'scheduledTime',
    header: 'Scheduled Time',
    cell: ({ row }) => row.original.scheduledTime || 'Not Scheduled',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';

      switch (status) {
        case 'COMPLETED':
          variant = 'default';
          break;
        case 'SCHEDULED':
          variant = 'secondary';
          break;
        case 'REQUESTED':
          variant = 'outline';
          break;
        case 'CANCELLED':
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
    header: 'Date Created',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];