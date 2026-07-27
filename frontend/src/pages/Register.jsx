import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { validateRegister, hasErrors } from '../utils/validators';
import { ROLES } from '../utils/constants';

const roleOptions = [
  { value: ROLES.CANDIDATE, label: 'Candidate', desc: 'Looking for a job' },
  { value: ROLES.RECRUITER, label: 'Recruiter', desc: 'Hiring for a team' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: ROLES.CANDIDATE });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateRegister(form);
    setErrors(validation);
    if (hasErrors(validation)) return;

    setSubmitting(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Could not create your account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
      <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">Start matching in minutes.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          {roleOptions.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setForm((f) => ({ ...f, role: opt.value }))}
              className={`rounded-lg border p-3 text-left transition-colors ${
                form.role === opt.value
                  ? 'border-brand-400 bg-brand-50 dark:bg-brand-500/10'
                  : 'border-slate-200 hover:border-slate-300 dark:border-white/10'
              }`}
            >
              <p className="text-sm font-semibold text-slate-800 dark:text-white">{opt.label}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
            </button>
          ))}
        </div>

        <div>
          <label className="label" htmlFor="name">Full name</label>
          <div className="relative">
            <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" className="input pl-9" />
          </div>
          {errors.name && <p className="mt-1.5 text-xs text-rose-500">{errors.name}</p>}
        </div>

        <div>
          <label className="label" htmlFor="email">Email</label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" className="input pl-9" />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-rose-500">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input id="password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="input pl-9" />
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-rose-500">{errors.password}</p>}
          </div>
          <div>
            <label className="label" htmlFor="confirmPassword">Confirm</label>
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" className="input pl-9" />
            </div>
            {errors.confirmPassword && <p className="mt-1.5 text-xs text-rose-500">{errors.confirmPassword}</p>}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline dark:text-brand-400">
          Log in
        </Link>
      </p>
    </div>
  );
}
