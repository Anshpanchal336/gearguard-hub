import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { StatusBadge } from '@/components/ui/status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  EQUIPMENT_OPTIONS, 
  TEAM_OPTIONS, 
  STATUS_OPTIONS,
  RequestStatus,
  TechnicianTeam,
  MaintenanceRequest,
} from '@/types/database';
import { ClipboardList, Search, Settings2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AllRequests() {
  const { userRole, profile, user } = useAuth();
  const { requests, isLoading, acceptRequest, isAccepting, updateRequest, isUpdating } = useMaintenanceRequests();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [updateForm, setUpdateForm] = useState({
    status: '' as RequestStatus,
    technician_team: '' as TechnicianTeam | '',
    time_duration: '',
  });

  const getEquipmentLabel = (value: string) => {
    return EQUIPMENT_OPTIONS.find((e) => e.value === value)?.label || value;
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = 
      getEquipmentLabel(request.equipment_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const openUpdateDialog = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setUpdateForm({
      status: request.status,
      technician_team: request.technician_team || '',
      time_duration: request.time_duration || '',
    });
  };

  const handleUpdate = () => {
    if (!selectedRequest) return;

    updateRequest(
      {
        requestId: selectedRequest.id,
        updates: {
          status: updateForm.status,
          technician_team: updateForm.technician_team || undefined,
          time_duration: updateForm.time_duration || undefined,
        },
      },
      {
        onSuccess: () => {
          setSelectedRequest(null);
        },
      }
    );
  };

  const canModify = (request: MaintenanceRequest) => {
    if (userRole === 'manager') return true;
    if (userRole === 'technician') {
      return request.assigned_technician_id === user?.id || request.status === 'new';
    }
    return false;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">All Requests</h1>
        <p className="text-muted-foreground">
          Manage and track all equipment maintenance requests
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by equipment, serial number, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ClipboardList className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Maintenance Requests</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredRequests.length} requests found
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-lg font-medium text-muted-foreground">No requests found</p>
              <p className="text-sm text-muted-foreground/70">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No maintenance requests have been submitted yet'}
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
                    <TableHead>Technician</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
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
                      <TableCell>
                        {request.time_duration || (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status === 'new' && userRole === 'technician' && (
                            <Button
                              size="sm"
                              onClick={() => acceptRequest(request.id)}
                              disabled={isAccepting}
                            >
                              Accept
                            </Button>
                          )}
                          {canModify(request) && request.status !== 'new' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openUpdateDialog(request)}
                            >
                              <Settings2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request</DialogTitle>
            <DialogDescription>
              Update the status and details for this maintenance request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={updateForm.status}
                onValueChange={(v: RequestStatus) => setUpdateForm({ ...updateForm, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.filter((s) => s.value !== 'new').map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Technician Team</Label>
              <Select
                value={updateForm.technician_team}
                onValueChange={(v: TechnicianTeam) => setUpdateForm({ ...updateForm, technician_team: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_OPTIONS.map((team) => (
                    <SelectItem key={team.value} value={team.value}>
                      {team.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Time Duration</Label>
              <Input
                placeholder="e.g., 2 hours"
                value={updateForm.time_duration}
                onChange={(e) => setUpdateForm({ ...updateForm, time_duration: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
