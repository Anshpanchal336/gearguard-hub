import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { MaintenanceRequest, RequestStatus, TechnicianTeam, EquipmentType } from '@/types/database';
import { sendToWebhook } from '@/lib/webhook';
import { toast } from 'sonner';

export function useMaintenanceRequests() {
  const { user, userRole, profile } = useAuth();
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ['maintenance-requests', user?.id, userRole],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MaintenanceRequest[];
    },
    enabled: !!user,
  });

  const createRequestMutation = useMutation({
    mutationFn: async (request: {
      equipment_name: EquipmentType;
      serial_number: string;
      problem_description: string;
      purchase_date?: string;
      warranty_duration?: string;
      location: string;
    }) => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert({
          ...request,
          requester_id: user!.id,
          status: 'new' as RequestStatus,
        })
        .select()
        .single();

      if (error) throw error;

      // Send to n8n webhook
      await sendToWebhook({
        action: 'create_request',
        data: {
          ...data,
          requester_email: profile?.email,
          requester_name: profile?.full_name,
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Request created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create request: ' + error.message);
    },
  });

  const acceptRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update({
          assigned_technician_id: user!.id,
          assigned_technician_name: profile?.full_name || 'Technician',
          assigned_technician_email: profile?.email,
          status: 'in_progress' as RequestStatus,
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      await sendToWebhook({
        action: 'accept_request',
        data: {
          ...data,
          technician_email: profile?.email,
          technician_name: profile?.full_name,
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Request accepted');
    },
    onError: (error) => {
      toast.error('Failed to accept request: ' + error.message);
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({
      requestId,
      updates,
    }: {
      requestId: string;
      updates: {
        status?: RequestStatus;
        technician_team?: TechnicianTeam;
        time_duration?: string;
      };
    }) => {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .update(updates)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;

      await sendToWebhook({
        action: 'update_request',
        data: {
          ...data,
          updated_by: profile?.email,
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-requests'] });
      toast.success('Request updated');
    },
    onError: (error) => {
      toast.error('Failed to update request: ' + error.message);
    },
  });

  return {
    requests: requestsQuery.data || [],
    isLoading: requestsQuery.isLoading,
    error: requestsQuery.error,
    createRequest: createRequestMutation.mutate,
    isCreating: createRequestMutation.isPending,
    acceptRequest: acceptRequestMutation.mutate,
    isAccepting: acceptRequestMutation.isPending,
    updateRequest: updateRequestMutation.mutate,
    isUpdating: updateRequestMutation.isPending,
  };
}
