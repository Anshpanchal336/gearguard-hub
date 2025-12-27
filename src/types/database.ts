export type AppRole = 'user' | 'technician' | 'manager';

export type RequestStatus = 'new' | 'in_progress' | 'repaired' | 'scrapped';

export type TechnicianTeam = 'it_support' | 'mechanical' | 'electrical';

export type EquipmentType = 
  | 'cnc' 
  | 'lathe_machine' 
  | 'milling_machine' 
  | 'generator' 
  | 'compressor' 
  | 'printer' 
  | 'laptop' 
  | 'server' 
  | 'ups';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export interface MaintenanceRequest {
  id: string;
  requester_id: string;
  equipment_name: EquipmentType;
  serial_number: string;
  problem_description: string;
  purchase_date: string | null;
  warranty_duration: string | null;
  location: string;
  assigned_technician_id: string | null;
  assigned_technician_name: string | null;
  assigned_technician_email: string | null;
  technician_team: TechnicianTeam | null;
  status: RequestStatus;
  time_duration: string | null;
  created_at: string;
  updated_at: string;
}

export const EQUIPMENT_OPTIONS: { value: EquipmentType; label: string }[] = [
  { value: 'cnc', label: 'CNC' },
  { value: 'lathe_machine', label: 'Lathe Machine' },
  { value: 'milling_machine', label: 'Milling Machine' },
  { value: 'generator', label: 'Generator' },
  { value: 'compressor', label: 'Compressor' },
  { value: 'printer', label: 'Printer' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'server', label: 'Server' },
  { value: 'ups', label: 'UPS' },
];

export const TEAM_OPTIONS: { value: TechnicianTeam; label: string }[] = [
  { value: 'it_support', label: 'IT Support' },
  { value: 'mechanical', label: 'Mechanical' },
  { value: 'electrical', label: 'Electrical' },
];

export const STATUS_OPTIONS: { value: RequestStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'repaired', label: 'Repaired' },
  { value: 'scrapped', label: 'Scrapped' },
];
