import { Outlet, Link } from 'react-router-dom';
import { FiTarget, FiUsers, FiTrendingUp } from 'react-icons/fi';

const highlights = [
  { icon: FiTarget, text: 'AI-matched candidates ranked by real fit, not keywords.' },
  { icon: FiUsers, text: 'A single pipeline for every applicant, from resume to offer.' },
  { icon: FiTrendingUp, text: 'Hiring analytics that show what is actually working.' },
];

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand-900 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.25),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(47,99,246,0.35),transparent_50%)]" />
        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 font-display text-lg font-bold backdrop-blur">
            H
          </div>
          <span className="font-display text-lg font-bold">HireLens</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="font-display text-3xl font-bold leading-tight">
            Hire the right person, faster — with AI that reads resumes like a recruiter does.
          </h2>
          <div className="mt-10 space-y-5">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <Icon size={16} />
                </div>
                <p className="text-sm text-brand-100">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-brand-200">© {new Date().getFullYear()} HireLens. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center bg-surface-light px-6 py-12 dark:bg-surface-dark">
        <div className="w-full max-w-sm animate-fadeIn">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
