import { useRef, useState } from 'react';
import { FiBell, FiMenu, FiMoon, FiSun, FiLogOut, FiSettings, FiUser, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useUserContext } from '../context/UserContext';
import useClickOutside from '../hooks/useClickOutside';
import { initials } from '../utils/formatters';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllRead } = useUserContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useClickOutside(menuRef, () => setMenuOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-4 backdrop-blur-md dark:border-white/5 dark:bg-surface-dark/80 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 md:hidden"
          aria-label="Toggle menu"
        >
          <FiMenu size={20} />
        </button>
        <div className="hidden md:block">
          <p className="text-sm text-slate-400">Welcome back,</p>
          <p className="font-display font-semibold text-slate-800 dark:text-white">{user?.name || 'there'} 👋</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            aria-label="Notifications"
          >
            <FiBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 animate-scaleIn rounded-xl2 border border-slate-100 bg-white p-2 shadow-soft-lg dark:border-white/10 dark:bg-card-dark">
              <div className="flex items-center justify-between px-2 py-1.5">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Notifications</p>
                {notifications.length > 0 && (
                  <button onClick={markAllRead} className="text-xs font-medium text-brand-500 hover:underline">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-2 py-6 text-center text-sm text-slate-400">You're all caught up.</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="rounded-lg px-2 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-white/5">
                      <p className="font-medium text-slate-700 dark:text-slate-200">{n.title}</p>
                      <p className="text-xs text-slate-400">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-2.5 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
              {initials(user?.name || 'U')}
            </div>
            <FiChevronDown size={14} className="text-slate-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 animate-scaleIn rounded-xl2 border border-slate-100 bg-white p-1.5 shadow-soft-lg dark:border-white/10 dark:bg-card-dark">
              <button
                onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <FiUser size={15} /> Profile
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate('/settings'); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5"
              >
                <FiSettings size={15} /> Settings
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-white/10" />
              <button
                onClick={() => { setMenuOpen(false); logout(); navigate('/login'); }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10"
              >
                <FiLogOut size={15} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
