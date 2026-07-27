import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiUpload, FiUser, FiBriefcase, FiUsers, FiPieChart,
  FiSettings, FiX, FiPlusCircle, FiTarget,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

const navByRole = {
  [ROLES.CANDIDATE]: [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/upload-resume', label: 'Upload Resume', icon: FiUpload },
    { to: '/profile', label: 'My Profile', icon: FiUser },
    { to: '/jobs', label: 'Job Listings', icon: FiBriefcase },
    { to: '/matching-results', label: 'Matching Results', icon: FiTarget },
  ],
  [ROLES.RECRUITER]: [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/jobs', label: 'Job Listings', icon: FiBriefcase },
    { to: '/jobs/create', label: 'Create Job', icon: FiPlusCircle },
    { to: '/applicants', label: 'Applicants', icon: FiUsers },
    { to: '/analytics', label: 'Analytics', icon: FiPieChart },
  ],
  [ROLES.ADMIN]: [
    { to: '/dashboard', label: 'Dashboard', icon: FiGrid },
    { to: '/jobs', label: 'Job Listings', icon: FiBriefcase },
    { to: '/applicants', label: 'Applicants', icon: FiUsers },
    { to: '/analytics', label: 'Analytics', icon: FiPieChart },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { role } = useAuth();
  const links = navByRole[role] || navByRole[ROLES.CANDIDATE];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-300 dark:border-white/5 dark:bg-card-dark md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-bold text-white">
              H
            </div>
            <span className="font-display text-lg font-bold text-slate-800 dark:text-white">HireLens</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 md:hidden" aria-label="Close menu">
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300'
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-4">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'
              }`
            }
          >
            <FiSettings size={17} />
            Settings
          </NavLink>
        </div>
      </aside>
    </>
  );
}
