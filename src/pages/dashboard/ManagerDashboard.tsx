import { useMemo } from 'react';
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
import { Progress } from '@/components/ui/progress';
import { EQUIPMENT_OPTIONS, TEAM_OPTIONS } from '@/types/database';
import { 
  ClipboardList, 
  Users,
  TrendingUp,
  Activity,
  Wrench,
  BarChart3,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ManagerDashboard() {
  const { requests, isLoading } = useMaintenanceRequests();

  // Calculate stats
  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === 'new').length;
    const inProgress = requests.filter((r) => r.status === 'in_progress').length;
    const completed = requests.filter(
      (r) => r.status === 'repaired' || r.status === 'scrapped'
    ).length;

    // Equipment breakdown
    const byEquipment = EQUIPMENT_OPTIONS.map((eq) => ({
      name: eq.label,
      count: requests.filter((r) => r.equipment_name === eq.value).length,
    })).filter((e) => e.count > 0).sort((a, b) => b.count - a.count);

    // Team breakdown
    const byTeam = TEAM_OPTIONS.map((team) => ({
      name: team.label,
      count: requests.filter((r) => r.technician_team === team.value).length,
    }));

    // Unique technicians
    const technicians = new Set(
      requests.filter((r) => r.assigned_technician_id).map((r) => r.assigned_technician_id)
    );

    return {
      total,
      pending,
      inProgress,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byEquipment,
      byTeam,
      technicianCount: technicians.size,
    };
  }, [requests]);

  const getEquipmentLabel = (value: string) => {
    return EQUIPMENT_OPTIONS.find((e) => e.value === value)?.label || value;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all equipment maintenance across the organization.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={stats.total}
          icon={<ClipboardList className="h-6 w-6" />}
        />
        <StatCard
          title="Active Technicians"
          value={stats.technicianCount}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Activity className="h-6 w-6" />}
          iconClassName="bg-status-progress/10 text-status-progress"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          iconClassName="bg-status-repaired/10 text-status-repaired"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Breakdown */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Requests by Equipment</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Distribution of maintenance requests
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.byEquipment.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data available
              </p>
            ) : (
              stats.byEquipment.slice(0, 5).map((item) => (
                <div key={item.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.count} requests</span>
                  </div>
                  <Progress 
                    value={(item.count / stats.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Team Workload */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Team Workload</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Requests assigned per team
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.byTeam.map((team) => (
              <div key={team.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{team.name}</span>
                  <span className="text-muted-foreground">{team.count} requests</span>
                </div>
                <Progress 
                  value={stats.total > 0 ? (team.count / stats.total) * 100 : 0} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* All Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>All Maintenance Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Complete overview of all requests
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <ClipboardList className="h-10 w-10 text-muted-foreground/50 mb-2" />
              <p className="text-muted-foreground">No requests yet</p>
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
                    <TableHead>Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.slice(0, 10).map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {getEquipmentLabel(request.equipment_name)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {request.serial_number}
                      </TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>
                        {request.assigned_technician_name || (
                          <span className="text-muted-foreground">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {request.technician_team ? (
                          TEAM_OPTIONS.find((t) => t.value === request.technician_team)?.label
                        ) : (
                          <span className="text-muted-foreground">—</span>
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
