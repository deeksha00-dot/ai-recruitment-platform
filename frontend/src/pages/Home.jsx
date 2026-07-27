import { Link } from 'react-router-dom';
import { FiArrowRight, FiTarget, FiZap, FiBarChart2, FiShield } from 'react-icons/fi';

const features = [
  {
    icon: FiTarget,
    title: 'Precision matching',
    text: 'Every resume is scored against the job on skills, experience, and education — not just keywords.',
  },
  {
    icon: FiZap,
    title: 'Faster shortlisting',
    text: 'Recruiters see ranked candidates the moment applications land, so the best profiles never sit unread.',
  },
  {
    icon: FiBarChart2,
    title: 'Hiring analytics',
    text: 'Track your funnel, top skills, and time-to-hire with dashboards built for recruiting teams.',
  },
  {
    icon: FiShield,
    title: 'Built for scale',
    text: 'Role-based access for candidates, recruiters, and admins keeps every workspace focused.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-bold text-white">H</div>
          <span className="font-display text-lg font-bold text-slate-800 dark:text-white">HireLens</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost">Log in</Link>
          <Link to="/register" className="btn-primary">Get started</Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center">
        <span className="inline-block rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          AI-Powered Applicant Tracking
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-slate-900 dark:text-white sm:text-5xl">
          Match the right candidate to the right role, automatically.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          HireLens reads resumes, scores candidates against your job requirements, and gives recruiters
          a ranked shortlist — so nothing great gets buried in an inbox.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="btn-primary px-6 py-3 text-base">
            Create free account <FiArrowRight />
          </Link>
          <Link to="/login" className="btn-secondary px-6 py-3 text-base">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-300">
                <Icon size={20} />
              </div>
              <h3 className="font-display font-semibold text-slate-800 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-100 px-6 py-8 text-center text-sm text-slate-400 dark:border-white/5">
        © {new Date().getFullYear()} HireLens. All rights reserved.
      </footer>
    </div>
  );
}
