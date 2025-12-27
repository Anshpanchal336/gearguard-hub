import { useMemo } from 'react';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TEAM_OPTIONS } from '@/types/database';
import { Users, UserCheck, Clock, CheckCircle } from 'lucide-react';

interface TechnicianStats {
  id: string;
  name: string;
  email: string;
  assigned: number;
  inProgress: number;
  completed: number;
  teams: Set<string>;
}

export default function Team() {
  const { requests, isLoading } = useMaintenanceRequests();

  const technicianStats = useMemo(() => {
    const statsMap = new Map<string, TechnicianStats>();

    requests.forEach((request) => {
      if (request.assigned_technician_id) {
        const existing = statsMap.get(request.assigned_technician_id);
        const isInProgress = request.status === 'in_progress';
        const isCompleted = request.status === 'repaired' || request.status === 'scrapped';

        if (existing) {
          existing.assigned += 1;
          if (isInProgress) existing.inProgress += 1;
          if (isCompleted) existing.completed += 1;
          if (request.technician_team) existing.teams.add(request.technician_team);
        } else {
          statsMap.set(request.assigned_technician_id, {
            id: request.assigned_technician_id,
            name: request.assigned_technician_name || 'Unknown',
            email: request.assigned_technician_email || '',
            assigned: 1,
            inProgress: isInProgress ? 1 : 0,
            completed: isCompleted ? 1 : 0,
            teams: new Set(request.technician_team ? [request.technician_team] : []),
          });
        }
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => b.assigned - a.assigned);
  }, [requests]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getTeamLabel = (teamValue: string) => {
    return TEAM_OPTIONS.find((t) => t.value === teamValue)?.label || teamValue;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Team Overview</h1>
        <p className="text-muted-foreground">
          Monitor technician workload and performance
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{technicianStats.length}</p>
              <p className="text-sm text-muted-foreground">Active Technicians</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-progress/10">
              <Clock className="h-6 w-6 text-status-progress" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {technicianStats.reduce((acc, t) => acc + t.inProgress, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-status-repaired/10">
              <CheckCircle className="h-6 w-6 text-status-repaired" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {technicianStats.reduce((acc, t) => acc + t.completed, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Completed Tasks</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technicians Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <UserCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Technicians</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Individual performance metrics
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : technicianStats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium text-muted-foreground">No technicians yet</p>
              <p className="text-sm text-muted-foreground/70">
                Technicians will appear here once they accept requests
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicianStats.map((tech) => {
                const completionRate = tech.assigned > 0 
                  ? Math.round((tech.completed / tech.assigned) * 100) 
                  : 0;

                return (
                  <Card key={tech.id} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {getInitials(tech.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{tech.name}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {tech.email || 'No email'}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Array.from(tech.teams).map((team) => (
                              <Badge key={team} variant="secondary" className="text-xs">
                                {getTeamLabel(team)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Completion Rate</span>
                          <span className="font-medium">{completionRate}%</span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                        
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="text-center">
                            <p className="text-lg font-bold">{tech.assigned}</p>
                            <p className="text-xs text-muted-foreground">Assigned</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-status-progress">{tech.inProgress}</p>
                            <p className="text-xs text-muted-foreground">Active</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-status-repaired">{tech.completed}</p>
                            <p className="text-xs text-muted-foreground">Done</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
