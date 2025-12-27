import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from './UserDashboard';
import TechnicianDashboard from './TechnicianDashboard';
import ManagerDashboard from './ManagerDashboard';

export default function DashboardIndex() {
  const { userRole } = useAuth();

  switch (userRole) {
    case 'technician':
      return <TechnicianDashboard />;
    case 'manager':
      return <ManagerDashboard />;
    default:
      return <UserDashboard />;
  }
}
