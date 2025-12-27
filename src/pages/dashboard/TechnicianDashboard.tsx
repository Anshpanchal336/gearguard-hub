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
import { Button } from '@/components/ui/button';
import { EQUIPMENT_OPTIONS } from '@/types/database';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  Wrench,
  UserCheck,
} from 'lucide-react';
import { format } from 'date-fns';

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const { requests, isLoading, acceptRequest, isAccepting } = useMaintenanceRequests();

  // Filter requests assigned to technician
  const myAssignedRequests = requests.filter(
    (r) => r.assigned_technician_id === user?.id
  );
  const newRequests = requests.filter((r) => r.status === 'new');

  // Calculate stats
  const totalAssigned = myAssignedRequests.length;
  const inProgress = myAssignedRequests.filter((r) => r.status === 'in_progress').length;
  const completed = myAssignedRequests.filter(
    (r) => r.status === 'repaired' || r.status === 'scrapped'
  ).length;
  const pendingNew = newRequests.length;

  const getEquipmentLabel = (value: string) => {
    return EQUIPMENT_OPTIONS.find((e) => e.value === value)?.label || value;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Technician Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and resolve equipment maintenance requests.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Requests"
          value={pendingNew}
          icon={<ClipboardList className="h-6 w-6" />}
          iconClassName="bg-status-new/10 text-status-new"
        />
        <StatCard
          title="My Assigned"
          value={totalAssigned}
          icon={<UserCheck className="h-6 w-6" />}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          icon={<Clock className="h-6 w-6" />}
          iconClassName="bg-status-progress/10 text-status-progress"
        />
        <StatCard
          title="Completed"
          value={completed}
          icon={<CheckCircle className="h-6 w-6" />}
          iconClassName="bg-status-repaired/10 text-status-repaired"
        />
      </div>

      {/* New Requests - Available to Accept */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-new/10">
            <ClipboardList className="h-5 w-5 text-status-new" />
          </div>
          <div>
            <CardTitle>New Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Available maintenance requests to accept
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : newRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <CheckCircle className="h-10 w-10 text-status-repaired/50 mb-2" />
              <p className="text-muted-foreground">No pending requests</p>
              <p className="text-sm text-muted-foreground/70">
                All maintenance requests have been assigned
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {getEquipmentLabel(request.equipment_name)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {request.problem_description}
                      </TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(request.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => acceptRequest(request.id)}
                          disabled={isAccepting}
                        >
                          Accept
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Assigned Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Wrench className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>My Assigned Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Requests you're currently working on
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {myAssignedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <Wrench className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">No assigned requests</p>
              <p className="text-sm text-muted-foreground/70">
                Accept a request to start working on it
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Problem</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myAssignedRequests.map((request) => (
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
                      <TableCell>{request.location}</TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        {request.time_duration || (
                          <span className="text-muted-foreground">—</span>
                        )}
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
