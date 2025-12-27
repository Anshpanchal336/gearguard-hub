import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMaintenanceRequests } from '@/hooks/useMaintenanceRequests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EQUIPMENT_OPTIONS, EquipmentType } from '@/types/database';
import { Wrench, Loader2, ArrowLeft } from 'lucide-react';

export default function NewRequest() {
  const navigate = useNavigate();
  const { createRequest, isCreating } = useMaintenanceRequests();

  const [formData, setFormData] = useState({
    equipment_name: '' as EquipmentType | '',
    serial_number: '',
    problem_description: '',
    purchase_date: '',
    warranty_duration: '',
    location: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.equipment_name) return;

    createRequest(
      {
        equipment_name: formData.equipment_name,
        serial_number: formData.serial_number,
        problem_description: formData.problem_description,
        purchase_date: formData.purchase_date || undefined,
        warranty_duration: formData.warranty_duration || undefined,
        location: formData.location,
      },
      {
        onSuccess: () => {
          navigate('/dashboard/requests');
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Request</h1>
          <p className="text-muted-foreground">
            Submit a new equipment maintenance request
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Wrench className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>Equipment Maintenance Request</CardTitle>
            <CardDescription>
              Fill in the details about the equipment that needs maintenance
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Equipment Name */}
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment Name *</Label>
              <Select
                value={formData.equipment_name}
                onValueChange={(value: EquipmentType) =>
                  setFormData({ ...formData, equipment_name: value })
                }
                required
              >
                <SelectTrigger id="equipment">
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <SelectItem key={eq.value} value={eq.value}>
                      {eq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Serial Number */}
            <div className="space-y-2">
              <Label htmlFor="serial">Serial Number *</Label>
              <Input
                id="serial"
                placeholder="e.g., SN-2024-001"
                value={formData.serial_number}
                onChange={(e) =>
                  setFormData({ ...formData, serial_number: e.target.value })
                }
                required
              />
            </div>

            {/* Problem Description */}
            <div className="space-y-2">
              <Label htmlFor="problem">Problem Description *</Label>
              <Textarea
                id="problem"
                placeholder="Describe the issue in detail..."
                value={formData.problem_description}
                onChange={(e) =>
                  setFormData({ ...formData, problem_description: e.target.value })
                }
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Purchase Date */}
              <div className="space-y-2">
                <Label htmlFor="purchase-date">Purchase Date</Label>
                <Input
                  id="purchase-date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) =>
                    setFormData({ ...formData, purchase_date: e.target.value })
                  }
                />
              </div>

              {/* Warranty Duration */}
              <div className="space-y-2">
                <Label htmlFor="warranty">Warranty Duration</Label>
                <Input
                  id="warranty"
                  placeholder="e.g., 2 years"
                  value={formData.warranty_duration}
                  onChange={(e) =>
                    setFormData({ ...formData, warranty_duration: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Building A, Floor 2, Room 201"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !formData.equipment_name}
                className="flex-1"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
