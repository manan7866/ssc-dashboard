// Define columns for the users data table
// This file is referenced by the DataTable component but may not exist yet

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// This is a simplified version - the actual implementation may vary
export const columns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge variant={
          role === 'ADMIN' ? 'default' :
          role === 'GENERAL' ? 'secondary' :
          role === 'DONOR' ? 'outline' :
          role === 'VOLUNTEER' ? 'destructive' :
          'secondary'
        }>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={
          status === 'APPROVED' ? 'default' :
          status === 'PENDING' ? 'secondary' :
          'destructive'
        }>
          {status}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      // These functions would be passed down from the parent component
      // For now, we'll just return a placeholder
      return (
        <div className="flex space-x-2">
          {user.status === 'PENDING' && (
            <>
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="outline">Reject</Button>
            </>
          )}
        </div>
      );
    },
  },
];