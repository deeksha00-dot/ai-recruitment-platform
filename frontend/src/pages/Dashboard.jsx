import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import CandidateDashboard from './CandidateDashboard';
import RecruiterDashboard from './RecruiterDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { role } = useAuth();

  if (role === ROLES.RECRUITER) return <RecruiterDashboard />;
  if (role === ROLES.ADMIN) return <AdminDashboard />;
  return <CandidateDashboard />;
}
