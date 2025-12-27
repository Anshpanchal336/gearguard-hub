import { useAuth } from '@/contexts/AuthContext';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { StatCard } from '@/components/ui/stat-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { EQUIPMENT_OPTIONS } from '@/types/database';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Wrench,
} from 'lucide-react';
import { format } from 'date-fns';

export default function UserDashboard() {
  const { user } = useAuth();
  const { requests, isLoading } = useMaintenanceRequests();

  // Filter requests for current user
  const userRequests = requests.filter((r) => r.requester_id === user?.id);

  // Calculate stats
  const totalRequests = userRequests.length;
  const inProgress = userRequests.filter((r) => r.status === 'in_progress').length;
  const solved = userRequests.filter((r) => r.status === 'repaired').length;
  const pending = userRequests.filter((r) => r.status === 'new').length;

  const getEquipmentLabel = (value: string) => {
    return EQUIPMENT_OPTIONS.find((e) => e.value === value)?.label || value;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your maintenance requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={totalRequests}
          icon={<ClipboardList className="h-6 w-6" />}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={<Clock className="h-6 w-6" />}
          iconClassName="bg-status-progress/10 text-status-progress"
        />
        <StatCard
          title="Solved"
          value={solved}
          icon={<CheckCircle className="h-6 w-6" />}
          iconClassName="bg-status-repaired/10 text-status-repaired"
        />
        <StatCard
          title="Pending"
          value={pending}
          icon={<AlertCircle className="h-6 w-6" />}
          iconClassName="bg-status-new/10 text-status-new"
        />
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Recent Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Your latest maintenance requests
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : userRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <ClipboardList className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">No requests yet</p>
              <p className="text-sm text-muted-foreground/70">
                Create your first maintenance request to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userRequests.slice(0, 5).map((request) => (
                    <TableRow key={request.id} className="group">
                      <TableCell className="font-medium">
                        {getEquipmentLabel(request.equipment_name)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {request.serial_number}
                      </TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>
                        {request.assigned_technician_name || (
                          <span className="text-muted-foreground">N/A</span>
                        )}
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
