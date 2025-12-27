import { useAuth } from '@/contexts/AuthContext';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { EQUIPMENT_OPTIONS } from '@/types/database';
import { ClipboardList, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function UserRequests() {
  const { user } = useAuth();
  const { requests, isLoading } = useMaintenanceRequests();
  const navigate = useNavigate();

  // Filter requests for current user
  const userRequests = requests.filter((r) => r.requester_id === user?.id);

  const getEquipmentLabel = (value: string) => {
    return EQUIPMENT_OPTIONS.find((e) => e.value === value)?.label || value;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Requests</h1>
          <p className="text-muted-foreground">
            View and track all your maintenance requests
          </p>
        </div>
        <Button onClick={() => navigate('/dashboard/new-request')}>
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>All Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {userRequests.length} total requests
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : userRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium text-muted-foreground">No requests yet</p>
              <p className="text-sm text-muted-foreground/70 mb-4">
                Submit your first equipment maintenance request
              </p>
              <Button onClick={() => navigate('/dashboard/new-request')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Request
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Warranty</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {getEquipmentLabel(request.equipment_name)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {request.serial_number}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.problem_description}
                      </TableCell>
                      <TableCell>
                        {request.purchase_date ? (
                          format(new Date(request.purchase_date), 'MMM d, yyyy')
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.warranty_duration || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {request.assigned_technician_name || (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </p>
                          {request.assigned_technician_email && (
                            <p className="text-xs text-muted-foreground">
                              {request.assigned_technician_email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(request.created_at), 'MMM d, yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
