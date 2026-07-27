import { FiMapPin, FiClock, FiBriefcase, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { timeAgo, truncate } from '../utils/formatters';

export default function JobCard({ job }) {
  return (
    <Link
      to={`/jobs/${job.id}`}
      className="card group flex flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-display text-lg font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
            {job.company?.[0]?.toUpperCase() || 'J'}
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-800 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
          </div>
        </div>
        {job.type && (
          <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
            {job.type}
          </span>
        )}
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400">{truncate(job.description, 110)}</p>

      <div className="flex flex-wrap gap-1.5">
        {(job.skills || []).slice(0, 4).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-white/5 dark:text-slate-300">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-white/5">
        <span className="flex items-center gap-1.5"><FiMapPin size={13} /> {job.location}</span>
        <span className="flex items-center gap-1.5"><FiBriefcase size={13} /> {job.experience_level || 'Any level'}</span>
        <span className="flex items-center gap-1.5"><FiUsers size={13} /> {job.applicant_count ?? 0} applicants</span>
        <span className="ml-auto flex items-center gap-1.5"><FiClock size={13} /> {timeAgo(job.created_at)}</span>
      </div>
    </Link>
  );
}
