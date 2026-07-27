import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiMoon, FiSun, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';

export default function Settings() {
  const { user, setUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile(profileForm);
      setUser((u) => ({ ...u, ...updated }));
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(err?.message || 'Could not update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters.');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword(passwordForm);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      toast.success('Password changed successfully.');
    } catch (err) {
      toast.error(err?.message || 'Could not change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account and preferences.</p>
      </div>

      <form onSubmit={handleProfileSave} className="card space-y-4 p-6">
        <h2 className="font-display font-semibold text-slate-800 dark:text-white">Profile</h2>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" value={profileForm.name} onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" value={profileForm.email} onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))} className="input" />
        </div>
        <button type="submit" disabled={savingProfile} className="btn-primary">
          <FiSave size={15} /> {savingProfile ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      <form onSubmit={handlePasswordSave} className="card space-y-4 p-6">
        <h2 className="font-display font-semibold text-slate-800 dark:text-white">Change Password</h2>
        <div>
          <label className="label" htmlFor="currentPassword">Current password</label>
          <input id="currentPassword" type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="newPassword">New password</label>
          <input id="newPassword" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))} className="input" />
        </div>
        <button type="submit" disabled={savingPassword} className="btn-primary">
          <FiLock size={15} /> {savingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <div className="card flex items-center justify-between p-6">
        <div>
          <h2 className="font-display font-semibold text-slate-800 dark:text-white">Appearance</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Switch between light and dark mode.</p>
        </div>
        <button onClick={toggleTheme} className="btn-secondary">
          {theme === 'dark' ? <><FiSun size={15} /> Light Mode</> : <><FiMoon size={15} /> Dark Mode</>}
        </button>
      </div>
    </div>
  );
}
